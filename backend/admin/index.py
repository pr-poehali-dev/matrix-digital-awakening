import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

ADMIN_SECRET = "matrix_admin_2025"

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Admin endpoint to view all registrations with filtering
    Args: event - dict with httpMethod, headers (X-Admin-Secret)
          context - object with request_id attribute
    Returns: HTTP response dict with list of registrations
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Secret',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    admin_secret = headers.get('X-Admin-Secret') or headers.get('x-admin-secret')
    
    if admin_secret != ADMIN_SECRET:
        return {
            'statusCode': 403,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Unauthorized'}),
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
    
    cursor.execute("""
        SELECT 
            id,
            email,
            pill_choice,
            registered_at,
            is_confirmed
        FROM registrations
        ORDER BY registered_at DESC
    """)
    
    registrations = cursor.fetchall()
    cursor.close()
    conn.close()
    
    registrations_list = []
    for reg in registrations:
        registrations_list.append({
            'id': reg['id'],
            'email': reg['email'],
            'pill_choice': reg['pill_choice'],
            'registered_at': reg['registered_at'].isoformat() if reg['registered_at'] else None,
            'is_confirmed': reg['is_confirmed']
        })
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'total': len(registrations_list),
            'registrations': registrations_list
        }),
        'isBase64Encoded': False
    }
