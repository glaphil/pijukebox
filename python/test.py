  
import RPi.GPIO as GPIO  
from time import sleep     # this lets us have a time delay (see line 12)  
  
# set up BCM GPIO numbering
GPIO.setmode(GPIO.BCM)     
# set gpio 6 as input with pull up resistor
GPIO.setup(6, GPIO.IN,pull_up_down=GPIO.PUD_UP)    

# Define a threaded callback function to run in another thread when events are detected  
def my_callback(channel):
    sleep(0.01)
    if GPIO.input(6):    
        print("Rising edge detected")
    else:                 
        print("Falling edge detected")  
  
GPIO.add_event_detect(6, GPIO.BOTH, callback=my_callback, bouncetime=100)  
    
try:  
    sleep(30)   
  
finally:                   
    GPIO.cleanup()           

