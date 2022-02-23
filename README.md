# lioranboard-2-livesplit-websocket

This is an extension for Lioranboard 2 that adds the ability to control livesplit, as well as get data or receive events using the LiveSplitWebsocket extension here: https://github.com/Xenira/LiveSplit-Websocket The livesplit Websocket there must be installed for this to work at all, so do that first!

# Install:
  1) Follow the instructions to download and install livesplit websocket from here: https://github.com/Xenira/LiveSplit-Websocket
  2) Download the release version of lioranboard-2-livesplit-websocket here: https://github.com/failstream/lioranboard-2-livesplit-websocket/releases/tag/v1.0.1
  3) Put livesplit.js into the same folder where your transmitter.html is located. This should be in the transmitter folder where you installed LioranBoard 2
  4) Open LioranBoard 2 and install the extension normally.

Once installed there will be a new board in LioranBoard that has everything you need to test the functionality and get started.

# Usage:

This extension adds three new commands and several triggers to LioranBoard 2 under Extension Commands > Transmitter.

   Connect to Livesplit:
      - You must run this command before you can do anything else. This will connect LioranBoard 2 to the websocket in livesplit and allow the two programs to communicate.
      
  * Livesplit Command:
      - This will send an instruction to Livesplit. Can be used to reset, start the timer, etc. using hotkeys or buttons from within LioranBoard.
      
  * Livesplit Get:
      - This sends a request for data from Livesplit and puts it into a variable of your choice. Fields are listed below.
      
          `data`        - This field is for modifying specific commands. I have not extensively tested this, so unless you know what you are doing leave it blank.
          
          `variable`    - This will be the variable name that LioranBoard will put your data into.
          
          `buttonID`    - This is so that you can choose a button for the variable to belong to so that it doesn't have to be global.
       
  * Extension Triggers
      - In addition to commands LioranBoard will also listen in for events from Livesplit that can trigger buttons. If you wish to create a button to listen for events, just create a button and give it an extension trigger with the	Message `livesplit *`. You can then pull the event as a wildcard. You could also just replace the * with whatever event it is you want to trigger the button, for example `livesplit pause` or `livesplit reset`.
  
      - Supported events are listed below.
            
            `pause`
            `reset`
            `resume`
            `skipSplit`
            `split`
            `start`
            `switchComparison`
            `undoAllPauses`
            `undoSplit`
            `pb`
            `gold`
            
      - In addition to the trigger, an object will also be packaged with the trigger. You can use the `Trigger Pull Data` command to get the data in the sent object.

          `Game`                - object with info on game, category, how many (completed) runs so far
          `splits`              - array of all splits with info, an object for each
          `splitindex`          - split number-1 for array usage (so you can do splits[splitindex])
          `bestpossibletime`    - best possible time from this point (in ms)
          `comparison`          - current active comparison (e.g. Personal Best, Average Segments)
          `delta`               - current amount ahead/behind (in ms)
          
      - These additional data points will be packaged with the object while a run is ongoing (after at least one split).

          `ahead`               - returns 1 if you're ahead of the comparison, 0 if behind
          `gained`              - returns 1 if you gained time in that split, 0 if you lost time
          `gold`                - returns 1 if the segment was your best ever, 0 if not
          
 # Troublshooting:

  * Websocket won't connect.
    - The websocket server in livesplit may not be on. This must be done manually each time you start livesplit or change layouts. Start the server by rightclicking on livesplit > control > Start Server (WS). After you do this make sure LioranBoard attempts to connect again with the `Connect to Livesplit` command
