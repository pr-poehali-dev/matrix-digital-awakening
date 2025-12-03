import json
import os
import secrets
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Handle participant registration with pill choice and email
    Args: event - dict with httpMethod, body (JSON with email, pillChoice)
          context - object with request_id attribute
    Returns: HTTP response dict with registration confirmation
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    email = body_data.get('email', '').strip().lower()
    pill_choice = body_data.get('pillChoice', '').strip().lower()
    
    if not email or '@' not in email:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Некорректный email'}),
            'isBase64Encoded': False
        }
    
    if pill_choice not in ['red', 'blue']:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Выберите пилюлю: red или blue'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute(
        "SELECT id, is_confirmed FROM registrations WHERE email = %s",
        (email,)
    )
    existing = cursor.fetchone()
    
    if existing:
        cursor.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Этот email уже зарегистрирован',
                'already_confirmed': existing['is_confirmed']
            }),
            'isBase64Encoded': False
        }
    
    confirmation_token = secrets.token_urlsafe(32)
    
    cursor.execute(
        "INSERT INTO registrations (email, pill_choice, confirmation_token) VALUES (%s, %s, %s) RETURNING id",
        (email, pill_choice, confirmation_token)
    )
    registration_id = cursor.fetchone()['id']
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True,
            'message': 'Регистрация успешна!',
            'registration_id': registration_id,
            'pill_choice': pill_choice,
            'confirmation_token': confirmation_token
        }),
        'isBase64Encoded': False
    }
