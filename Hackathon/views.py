# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt  # CSRF 비활성화가 필요할 경우

@csrf_exempt  # 개발 시에만 사용 권장
def my_api_view(request):
    if request.method == 'POST':
        data = request.POST.get('data')  # 요청 데이터 받기
        response_data = {'message': f'받은 데이터: {data}'}
        return JsonResponse(response_data)  # JSON 형식으로 응답 반환
    else:
        return JsonResponse({'error': 'POST 요청만 허용됩니다.'}, status=400)