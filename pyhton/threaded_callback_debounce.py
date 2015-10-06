import RPi.GPIO as GPIO
from time import sleep  

# on numérote les PINs dans l'ordre de leur disposition
GPIO.setmode(GPIO.BOARD)

# par défaut voltage haut
GPIO.setup(7, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# un fil va du GPIO au boutton, et du bouton à la terre

def my_callback(channel):
    print('Edge detected on channel %s'%channel)

GPIO.add_event_detect(7, GPIO.RISING, callback=my_callback, bouncetime=200) 


# juste pour bloquer l'exécution pour montrer que c'est sur un autre thread que l'event est traité
key = input("press a key? ")
print(key)

#try:  
#  while True:  
#	sleep(0.2)    
# except KeyboardInterrupt:          # trap a CTRL+C keyboard interrupt  
#	print("end")
  
GPIO.cleanup()
