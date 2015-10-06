import RPi.GPIO as GPIO
from time import sleep  

# on numérote les PINs dans l'ordre de leur disposition
GPIO.setmode(GPIO.BOARD)

# par défaut voltage haut
GPIO.setup(7, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# un fil va du GPIO au boutton, et du bouton à la terre

def my_callback(channel):
    print('This is a edge event callback function!')
    print('Edge detected on channel %s'%channel)
    print('This is run in a different thread to your main program')


GPIO.add_event_detect(7, GPIO.RISING)
GPIO.add_event_callback(7, my_callback)
