#!/usr/bin/env python

import time
import pigpio

GPIO=6

def my_callback(gpio, level, tick):
   if level == 1:   
      print("Rising edge detected at", tick)
   else:                 
      print("Falling edge detected at", tick)
 
pi = pigpio.pi() # Connect to local Pi.

pi.set_pull_up_down(GPIO, pigpio.PUD_UP)   
pi.set_mode(GPIO, pigpio.INPUT)   

cb = pi.callback(GPIO, pigpio.EITHER_EDGE, my_callback)
   
time.sleep(30)   

cb.cancel() # Cancel callback.

pi.stop() # Disconnect from local Pi.
