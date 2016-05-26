#!/usr/bin/python

import serial

def connectToSerial():
  ser = 0
  try:
    ser = 0
    ser = serial.Serial('/dev/ttyACM0',9600,timeout=0)
    return ser
  except Exception, e:
    print "Error opening the serial port: " + str(e)
    exit()

def readAndCleanData(conn):
  data = conn.readline().rstrip().decode("utf-8")
  if ((data.isdigit()) and (data != '1')):
    return int(data)
  else:
    return 0



############ MAIN #############
conn = connectToSerial()

sum = 0 
count = 0
try:
  while True:
    data = readAndCleanData(conn)
    sum = sum + data
    count = count + 1
    if (count > 50000):
      avg = int((sum / float(count)) * 1000)
      f = open('garage-data.txt','w')
      f.write(str(avg) + '\n')
      f.flush()
      f.close()
      sum = 0
      count = 0
except KeyboardInterrupt:
  print 'Exiting the script!\n'
