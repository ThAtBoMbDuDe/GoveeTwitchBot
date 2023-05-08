const tmi = require('tmi.js');
const govee = require('govee-api');
const config = require('./config.js');
const videojs = require('video.js')

//variables and functions
const devices = config.devices
//NOTE. Govee API only allows for 10 requests per minute, so only set 10 devices per array

const player = videojs('video-player', {
  controls: false,
  autoplay: true,
  preload: 'auto',
});
const twitchBotToken = config.twitchBotToken;
const goveeToken = config.goveeToken;
const deviceModel = config.deviceModel;
const twitchBotName = config.twitchBotName;
const twitchChannel= config.twitchChannel;
let lightCommandTimestamp = 0;
let prCommandTimestamp = 0;
let bioCommandTimestamp = 0;
let commandListTimestamp = 0
const sendIntervalMs = 900000
const sendMessage = () => {
  const now = Date.now();
  if(now - commandListTimestamp < sendIntervalMs) {
    return}
  client.say(twitchChannel, `Good Company Bot is online and ready to mingle! If you would like to find out more about the members of Good Company, then '$' and '?' commands are the way. If you would like to change the color of the lights for the gym, then a '!' command is the way. A '$' followed by a name you know at Good Company will give you a list of said persons PR's. A '?' followed by a name will give you a short bio and background of that person. A '!' followed by a color will change the color of the lights.`);
  client.say(twitchChannel, ` Good Company: Jon, James, Tal, Joseph, Joey, Veda, Kirsten, Alanna, David, Jake, Alejandro, Amanda, Jenna, Isaiah, Chantel.
  Colors:: !red, !orange, !yellow, !green, !blue, !purple, !sky, !white, !snow, !pink, !aqua, !magenta, !dodger, !spring, !smoke, !lavender, !willywonka, !darth, !barbie, !hooyah.`);
  commandListTimestamp = now;
};

//check for 'on' or 'off' function
const checkPowerState = async () => {
      govee.initDevice( goveeToken, "5B:F5:C6:38:32:31:29:83", deviceModel);
      const deviceState = await govee.status.getDeviceStatus();
      const powerState = deviceState.properties[1].powerState;
      if (powerState === 'on') {
        return "on"
      } else {
        return "off"
      }
};
//set color functions
const setRed = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(255, 0, 0);    
  });
};
const setBlue = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(0, 0, 255);
  });
};
const setGreen = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(0, 255, 0);
  });
};
const setOrange = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(255, 128, 0);
  });
};
const setYellow = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(255, 255, 0);
  });
};
const setPink = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(255, 0, 127);
  });
};
const setPurple = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(127, 0, 255);
  });
};
const setWhite = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(255, 255, 255);
  });
};
const setAqua = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(0, 255, 255);
  });
};
const setMagenta = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(255, 0, 255);
  });
};
const setSkyBlue = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(0, 191, 255);
  });
};
const setDodgerBlue = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(30, 144, 255);
  });
};
const setSpringGreen = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(0, 255, 127);
  });
};
const setSmokeWhite = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(245, 245, 245);
  });
};
const setSnowWhite = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(255, 250, 250);
  });
};
const setLavender = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(221, 160, 221);
  });
};
const setChocolate = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(210, 105, 30);
  });
};
const setBlack = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(20, 20, 20);
  });
};
const setHotPink = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(255, 20, 147);
  });
};
const setNavy = () => {
  devices.forEach(device => {
    govee.initDevice( goveeToken, device, deviceModel);
    govee.control.setColor(0, 0, 128);
  });
};


//Connection
const options = {
  options: {
  debug: true
},
connection: {
  secure: true,
  reconnect: true
},
identity: {
  username: twitchBotName,
  password: twitchBotToken
},
channels: [twitchChannel]
};
const client = new tmi.Client(options);

client.connect();

client.on('connected', (address, port) => {
  console.log(`Connected to ${address}:${port}`);
  sendMessage()
 });

setInterval(() => {
  sendMessage();
}, sendIntervalMs);

//Bio command listener
client.on('chat', (channel, message, userstate, self, tags) => {
  if(self) return;
  const chatMessage = userstate;
  if(!chatMessage.startsWith('?')) {
    return
  };
  const now = Date.now();
  const cooldownDurationMs = 10000; 
    if (now - bioCommandTimestamp < cooldownDurationMs) {
      const remainingCooldownMs = cooldownDurationMs - (now - bioCommandTimestamp);
      const remainingCooldownSec = Math.ceil(remainingCooldownMs / 1000);
     client.say(channel, `Please wait ${remainingCooldownSec} seconds before using this command again.`);
      return;
    };
    if(chatMessage.toLowerCase() === '?jake' || chatMessage.toLowerCase() === '?jacob') {
      client.say(channel, 'Jake grew up in Southern California. He served in the U.S. Navy for 7 years as an EOD Tech. He is currently working on his BS in Alternative and Renewable Energy Management and codes in Javascript/Python for fun projects(like this chatbot). Check out his youtube channel "ThAtBoMbDuDe".')
    };
    if(chatMessage.toLowerCase() === '?veda' || chatMessage.toLowerCase() === '?darthveda') {
      client.say(channel, 'Veda grew up in the barren boonies of Pennsylvania. She built and co-owned an MMA gym with her father for the family business. She trained and competed in American-style Jiu-Jitsu through her youth, up until 2020. She is currently pursuing certifications in a fitness career tailored to helping women pre, intra, and post pregnancy.')
    };
    if(chatMessage.toLowerCase() === '?jon' || chatMessage.toLowerCase() === '?jonathon') {
      client.say(channel, 'Jon was born and raised in Amish country Pennsylvania. He served in the U.S. Navy for 5 years as a Rescue Swimmer. Currently, Jon is working as a builder and Co-Owner at OWR. Working out is his passion, hence why he and OWR built this gym.')
    };
    if(chatMessage.toLowerCase() === '?james') {
      client.say(channel, 'James bio pending')
    };
    if(chatMessage.toLowerCase() === '?joah' || chatMessage.toLowerCase() === '?joseph') {
      client.say(channel, 'Joseph was born and raised in Lancaster, Pennsylvania. His workout style is muscle isolation, calisthenics, and full body HIT training. His goals are to reach 190lbs body weight while maintaining 7% body fat. His PR goals are to bench 315, squat 405, and deadlift 500.')
    };
    if(chatMessage.toLowerCase() === '?al' || chatMessage.toLowerCase() === '?alejandro') {
      client.say(channel, 'Als bio pending')
    };
    if(chatMessage.toLowerCase() === '?tal') {
      client.say(channel, 'Tals bio pending')
    };
    if(chatMessage.toLowerCase() === '?david' || chatMessage.toLowerCase() === '?dave') {
      client.say(channel, 'Just Dave.')
    };
    if(chatMessage.toLowerCase() === '?isaiah') {
      client.say(channel, 'Isaiahs bio pending')
    };
    if(chatMessage.toLowerCase() === '?joey') {
      client.say(channel, 'Joeys bio pending')
    };
    if(chatMessage.toLowerCase() === '?chantel') {
      client.say(channel, 'Chantels bio pending')
    };
    if(chatMessage.toLowerCase() === '?jenna') {
      client.say(channel, 'Jennas bio pending')
    };
    if(chatMessage.toLowerCase() === '?alanna') {
      client.say(channel, 'Alannas bio pending')
    };
    if(chatMessage.toLowerCase() === '?amanda') {
      client.say(channel, 'Amandas bio pending')
    };
    if(chatMessage.toLowerCase() === '?kirsten') {
      client.say(channel, 'Kirstens bio pending')
    };
    if(chatMessage.toLowerCase() === '?epstein') {
      client.say(channel, 'Epstein did not kill himself.')
    };
    bioCommandTimestamp = now;
});



//PR command listener
client.on('chat', (channel, message, userstate, self, tags) => {
  if(self) return;
  const chatMessage = userstate;
  if(!chatMessage.startsWith('$')) {
    return
  };  
  const now = Date.now();
  const cooldownDurationMs = 20000; 
    if (now - prCommandTimestamp < cooldownDurationMs) {
      const remainingCooldownMs = cooldownDurationMs - (now - prCommandTimestamp);
      const remainingCooldownSec = Math.ceil(remainingCooldownMs / 1000);
      client.say(channel, `Please wait ${remainingCooldownSec} seconds before using this command again.`);
      return;
    };  
    if(chatMessage.toLowerCase() === '$jake' || chatMessage.toLowerCase() === '$jacob') {
      client.say(channel, 'Jakes PR === Front Squat:355 | Clean:305 | C&J:275 | Snatch:245 | Back Squat:385 | Deadlift:405 | Bench:295 | Pull-ups:22 | 1.5Mile=9:12 | 500mSwim=8:04 | Half-Marathon=2:19:19')
    };
    if(chatMessage.toLowerCase() === '$veda' || chatMessage.toLowerCase() === '$darthveda') {
      client.say(channel, 'Vedas PR === Bench:115 | Sumo Deadlift:200 | Deadlift:200 | Back Squat:185 | Front Squat:165 | Clean:65 | Half-Marathon=2:35:47')
    };
    if(chatMessage.toLowerCase() === '$jon' || chatMessage.toLowerCase() === '$jonathon') {
      client.say(channel, 'Jons PR === Bench:315 | Back Squat:365 | Deadlift:500 | Clean:295 | 1.5Mile=8:59 | Half-Marathon=2:06:27')
    };
    if(chatMessage.toLowerCase() === '$james') {
      client.say(channel, 'James PRs pending')
    };
    if(chatMessage.toLowerCase() === '$joah' || chatMessage.toLowerCase() === '$joseph') {
      client.say(channel, 'Josephs PR === Bench:275 || Back Squat:365 || Deadlift:405 || Half-Marathon=2:15:41')
    };
    if(chatMessage.toLowerCase() === '$al' || chatMessage.toLowerCase() === '$alejandro') {
      client.say(channel, 'Als PRs pending')
    };
    if(chatMessage.toLowerCase() === '$tal') {
      client.say(channel, 'Tals PRs pending')
    };
    if(chatMessage.toLowerCase() === '$david' || chatMessage.toLowerCase() === '$dave') {
      client.say(channel, 'Davids PR === Bench:365 | Overhead Press:225 | Back Squat:405 | Deadlift:315 | Front Squat:245  | Pull-ups:26 | 1.5Mile=8:56 | 500mSwim=6:15 | .25Mile=0:52 | 1min Push-ups:115 | 1min Sit-ups: 120')
    };
    if(chatMessage.toLowerCase() === '$isaiah') {
      client.say(channel, 'Isaiahs PRs pending')
    };
    if(chatMessage.toLowerCase() === '$joey') {
      client.say(channel, 'Joeys PRs pending')
    };
    if(chatMessage.toLowerCase() === '$chantel') {
      client.say(channel, 'Chantels PRs pending')
    };
    if(chatMessage.toLowerCase() === '$jenna') {
      client.say(channel, 'Jennas PRs pending')
    };
    if(chatMessage.toLowerCase() === '$alanna') {
      client.say(channel, 'Alannas PRs pending')
    };
    if(chatMessage.toLowerCase() === '$amanda') {
      client.say(channel, 'Amandas PRs pending')
    };
    if(chatMessage.toLowerCase() === '$kirsten') {
      client.say(channel, 'Kirstens PRs pending')
    };
    prCommandTimestamp = now;
});


//First time chat listener
client.on('chat', (channel, message, userstate, tags, self) => {
  if (self) return;
  const chatter = message.username
  const firstTimer = message['first-msg'];
  if(firstTimer === true){
    client.say(twitchChannel, `Welcome ${chatter} to Good Company! Stick around and hang a while! We've got '$' and '?' commands for info on all of the people at Good Company. If you'd like the change the color of the gym lighting, try '!' commands. Don't be afraid to chat away and we hope you enjoy the stream!`);
    client.say(twitchChannel, ` Good Company: Jon, James, Tal, Joseph, Joey, Veda, Kirsten, Alanna, David, Jake, Alejandro, Amanda, Jenna, Isaiah, Chantel.
    Colors:: !red, !orange, !yellow, !green, !blue, !purple, !sky, !white, !snow, !pink, !aqua, !magenta, !dodger, !spring, !smoke, !lavender, !willywonka, !darth, !barbie, !hooyah.`);
  };
});


//Color command listener
client.on('chat', async (channel, message, userstate, tags, self) => {
  if (self) return;
  const chatCommand = userstate;
  if (!chatCommand.startsWith('!')) {
    return
  }
  const now = Date.now();
  const cooldownDurationMs = 60000;
  const lightsOn = await checkPowerState();
  if(lightsOn != 'on'){
    client.say(channel, `Unfortunately, the gym lights are currently not on.`);
    return;
  };  
  if (now - lightCommandTimestamp < cooldownDurationMs) {
    const remainingCooldownMs = cooldownDurationMs - (now - lightCommandTimestamp);
    const remainingCooldownSec = Math.ceil(remainingCooldownMs / 1000);
    client.say(channel, `Please wait ${remainingCooldownSec} seconds before using this command again.`);
    return;
  };  
  if (chatCommand.toLowerCase() === '!red') {
    try {
      setRed();
      client.say(channel, `The Lights are Red!`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  if (chatCommand.toLowerCase() === '!blue') {
    try {
      setBlue();
      client.say(channel, `The Lights are Blue!`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  if (chatCommand.toLowerCase() === '!green') {
    try {
      setGreen();
      client.say(channel, `The Lights are Green!`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  if (chatCommand.toLowerCase() === '!orange') {
    try {
      setOrange();
      client.say(channel, `The Lights are Orange!`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  if (chatCommand.toLowerCase() === '!yellow') {
    try {
      setYellow();
      client.say(channel, `The Lights are Yellow!`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  if (chatCommand.toLowerCase() === '!pink') {
    try {
      setPink();
      client.say(channel, `The Lights are Pink!`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  if (chatCommand.toLowerCase() === '!purple') {
    try {
      setPurple();
      client.say(channel, `The Lights are Purple!`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  if (chatCommand.toLowerCase() === '!white') {
    try {
      setWhite();
      client.say(channel, `The Lights are White!`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  if (chatCommand.toLowerCase() === '!magenta') {
    try {
      setMagenta();
      client.say(channel, `The Lights are Magenta!`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  if (chatCommand.toLowerCase() === '!aqua') {
    try {
      setAqua();
      client.say(channel, `The Lights are Aqua!`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  if (chatCommand.toLowerCase() === '!sky') {
    try {
      setSkyBlue();
      client.say(channel, `The Lights are Sky Blue!`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  if (chatCommand.toLowerCase() === '!dodger') {
    try {
      setDodgerBlue();
      client.say(channel, `The Lights are Dodger Blue!`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  if (chatCommand.toLowerCase() === '!spring') {
    try {
      setSpringGreen();
      client.say(channel, `The Lights are Spring Green!`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  if (chatCommand.toLowerCase() === '!snow') {
    try {
      setSnowWhite();
      client.say(channel, `The Lights are Snowy!`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  if (chatCommand.toLowerCase() === '!smoke') {
    try {
      setSmokeWhite();
      client.say(channel, `The Lights are Smokey!`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  if (chatCommand.toLowerCase() === '!lavender') {
    try {
      setLavender();
      client.say(channel, `The Lights are Lavender!`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  if (chatCommand.toLowerCase() === '!willywonka') {
    try {
      setChocolate();
      client.say(channel, `She was a bad egg.`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  if (chatCommand.toLowerCase() === '!darth') {
    try {
      setBlack();
      client.say(channel, `I find your lack of faith disturbing.`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  if (chatCommand.toLowerCase() === '!barbie') {
    try {
      setHotPink();
      client.say(channel, `Life is plastic. It's fantastic!`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  if (chatCommand.toLowerCase() === '!hooyah') {
    try {
      setNavy();
      client.say(channel, `Anchors Aweigh, my boys, Anchors Aweigh.
      Farewell to college joys, we sail at break of day-ay-ay-ay.
      Through our last night on shore, drink to the foam,
      Until we meet once more. Here's wishing you a happy voyage home`);
    } catch (error) {
      console.error(`Error setting lights: ${error}`);
    }
  };
  lightCommandTimestamp = now;
});

client.on('chat', (channel, message, userstate, tags, self) => {
  const videoCommand = userstate

  if (!chatCommand.startsWith('&')) {
    return
  };
  // Check if the message is a "!play" command
  if (videoCommand.toLowerCase() === '&tal') {
    // Get the YouTube video ID from a URL (e.g. "https://www.youtube.com/watch?v=VIDEO_ID")
    const videoId = 'MFOqoKX8n88';

    // Create a URL for the YouTube video
    const videoUrl = `https://www.youtube.com/embed/${videoId}?controls=0?autoplay=1`;

    // Set the source of the video player to the YouTube video URL
    player.src(videoUrl);

    // Show the video overlay
    player.show();
  }
});


