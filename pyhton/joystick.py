""" rpi-gpio-jstk.py by Chris Swan 9 Aug 2012
GPIO Joystick driver for Raspberry Pi for use with 80s 5 switch joysticks
based on python-uinput/examples/joystick.py by tuomasjjrasanen
https://github.com/tuomasjjrasanen/python-uinput/blob/master/examples/joystick.py

requires uinput kernel module (sudo modprobe uinput)
requires python-uinput (git clone https://github.com/tuomasjjrasanen/python-uinput)
requires (from http://pypi.python.org/pypi/RPi.GPIO/0.3.1a)

for detailed usage see http://blog.thestateofme.com/2012/08/10/raspberry-pi-gpio-joystick/
"""
import uinput
import time


import uinput


events = (uinput.KEY_E)
 
device = uinput.Device(events)
 
# Bools to keep track of movement

 
# Center joystick
# syn=False to emit an "atomic" (128, 128) event.

while True:
	device.emit(uinput.KEY_E, 1)
	time.sleep(.02) # Poll every 20ms (otherwise CPU load gets too high)	
