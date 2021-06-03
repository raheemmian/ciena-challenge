from django.shortcuts import render
from django.http import HttpResponse
import requests
import json

def home(request):
    response = requests.get('http://flaskosa.herokuapp.com/cmd/TRACE').json()
    return render(request, 'index.html',{'response': response})

def single(request):
    while 1 :
        print("Processing single request")
        try:
            response = requests.get('http://flaskosa.herokuapp.com/cmd/SINGLE', timeout = 300)
        except requests.exceptions.Timeout:
            print("Timeout single request")
            return HttpResponse("timeout - reload the page")
        if(response.text == "+READY>SINGLE:OK"):
            try:
                print("Getting JSON Trace")
                response = requests.get('http://flaskosa.herokuapp.com/cmd/TRACE', timeout = 300).json()
            except requests.exceptions.Timeout:
                print("Timeout Trace Request")
                return HttpResponse("timeout - reload the page")
            break   
    print("Success sending data to chart.html")
    return render(request, 'chart.html',{
        'xlabel': response["xlabel"], 
        'ylabel' : response["ylabel"],
        'xdata'  : response["xdata"],
        'ydata'  : response["ydata"],
        "time"   : response["timestamp"],
        'xunits' : response['xunits'],
        'yunits' : response['yunits']
        })


def start(request):
    while 1 :
        try:
            print("Processing Start request")
            response = requests.get('http://flaskosa.herokuapp.com/cmd/START', timeout = 300)
        except requests.exceptions.Timeout:
            print("Timeout Start request")
            return HttpResponse("timeout - reload the page")
        if(response.text == "+READY>RUN:OK"):
            break 
    print("Success acquiring data")    
    return render(request, 'start.html')


def stop(request):
    while 1 :
        try:
            print("Processing Stop request")
            response = requests.get('http://flaskosa.herokuapp.com/cmd/STOP', timeout = 300)
        except requests.exceptions.Timeout:
            print("Timeout Stop request")
            return HttpResponse("timeout - reload the page")
        if(response.text == "+READY>STOP:OK"):
            try:
                print("Getting JSON Trace")
                response = requests.get('http://flaskosa.herokuapp.com/cmd/TRACE', timeout = 300).json()
            except requests.exceptions.Timeout:
                print("Timeout Trace request")
                return HttpResponse("timeout - reload the page")
            break   
    print("Success sending data to chart.html")  
    return render(request, 'chart.html',{
        'xlabel': response["xlabel"], 
        'ylabel' : response["ylabel"],
        'xdata'  : response["xdata"],
        'ydata'  : response["ydata"],
        "time"   : response["timestamp"],
        'xunits' : response['xunits'],
        'yunits' : response['yunits']
        })