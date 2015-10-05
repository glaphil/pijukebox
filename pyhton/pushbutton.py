import RPi.GPIO as GPIO


GPIO.setmode(GPIO.BOARD)

GPIO.setup(7, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

#GPIO.setup(11, GPIO.IN, pull_up_down=GPIO.PUD_UP)

print("simple button push test")    

try:  
  while True:  
    sleep(0.2)
    if GPIO.input(7):               
      print("button down, gpio HIGH")
    else:
      print("button up, gpio DOWN")

    #if GPIO.input(11):               
    #  print("button up, gpio HIGH")
    #else:
    #  print("button down, gpio DOWN") 

except KeyboardInterrupt:          # trap a CTRL+C keyboard interrupt  
  print("end")
