#!/usr/bin/env python2.7  
# demo of "BOTH" bi-directional edge detection  
# script by Alex Eames http://RasPi.tv  
# http://raspi.tv/?p=6791  
  
import RPi.GPIO as GPIO  
from time import sleep     # this lets us have a time delay (see line 12)  
  
GPIO.setmode(GPIO.BCM)     # set up BCM GPIO numbering  
GPIO.setup(6, GPIO.IN)    # set GPIO25 as input (button)  
  
# Define a threaded callback function to run in another thread when events are detected  
def my_callback(channel):  
    if GPIO.input(6):     # if port 25 == 1  
        print("Rising edge detected on 25")  
    else:                  # if port 25 != 1  
        print("Falling edge detected on 25")  
  
# when a changing edge is detected on port 25, regardless of whatever   
# else is happening in the program, the function my_callback will be run  
GPIO.add_event_detect(6, GPIO.BOTH, callback=my_callback)  
    
try:  
    sleep(30)         # wait 30 seconds  
  
finally:                   # this block will run no matter how the try block exits  
    GPIO.cleanup()         # clean up after yourself  

