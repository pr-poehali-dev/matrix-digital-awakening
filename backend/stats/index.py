import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get registration statistics for counter display
    Args: event - dict with httpMethod
          context - object with request_id attribute
    Returns: HTTP response dict with total count and pill distribution
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
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
    
    cursor.execute("SELECT COUNT(*) as total FROM registrations")
    total_result = cursor.fetchone()
    total_count = total_result['total'] if total_result else 0
    
    cursor.execute("""
        SELECT 
            pill_choice,
            COUNT(*) as count
        FROM registrations
        GROUP BY pill_choice
    """)
    pill_stats = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    red_count = 0
    blue_count = 0
    
    for stat in pill_stats:
        if stat['pill_choice'] == 'red':
            red_count = stat['count']
        elif stat['pill_choice'] == 'blue':
            blue_count = stat['count']
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'total': total_count,
            'red_pill': red_count,
            'blue_pill': blue_count
        }),
        'isBase64Encoded': False
    }
