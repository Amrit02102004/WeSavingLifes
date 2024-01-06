from django.http import JsonResponse
from django.shortcuts import render
import json

def index(request):
    return render(request, 'index.html')

def get_next_char(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        message = data.get('message', '')
        print(message)
        next_char = chr(ord(message)+1)
        return JsonResponse({'reply': next_char})
    else:
        return JsonResponse({'error': 'Invalid input'})
