import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
#GPIO TEST pin is the output I'm testing
TEST = 4 # I change this everytime I test another pin with a multimeter
GPIO.setup(TEST, GPIO.OUT)
try:
	while true:
		GPIO.output(TEST, GPIO.HIGH)
except KeyboardInterrupt:
	GPIO.cleanup()
finally:
	GPIO.cleanup     

