#autre lib https://pythonhosted.org/RPIO/rpio_py.html
import logging
log_format = '%(levelname)s | %(asctime)-15s | %(message)s'
logging.basicConfig(format=log_format, level=logging.DEBUG)

import RPi.GPIO as GPIO            # import RPi.GPIO module  
from time import sleep             # lets us have a delay  
GPIO.setmode(GPIO.BCM)             # choose BCM or BOARD  
GPIO.setup(4, GPIO.OUT)           # set GPIO4 as an output   

print("start")
try:  
	while True:  
		GPIO.output(4, 1)         # set GPIO4 to 1/GPIO.HIGH/True  
		sleep(1)                 # wait half a second  
		if GPIO.input(4):  
			print("LED just about to switch off")  
		GPIO.output(4, 0)         # set GPIO4 to 0/GPIO.LOW/False  
		sleep(1)                 # wait half a second  
		if not GPIO.input(4):  
			print("LED just about to switch on")  
except KeyboardInterrupt:          # trap a CTRL+C keyboard interrupt  
	GPIO.cleanup()                 # resets all GPIO ports used by this program 


