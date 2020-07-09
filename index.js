const Discord = require('discord.js');
const bot = new Discord.Client();

const cheerio = require('cheerio');

const request = require('request');

const ytdl = require('ytdl-core');

const opusscript = require('opusscript');

const token = 'NzEzMDI5MDc3NzE1Mzg2NDg4.XsaLIA.jeFsAgebglpgaf17XIb4x8eGgUI';

var servers = {};

const PREFIX = '~';

bot.on('ready', () => {
  console.log("Ready to fuk some shit up!");
  bot.user.setActivity("Reking N00bs");
});

var connected = false;

var jap_sentence = [ ["お前、これを本当に翻訳したのか。"], ["今は、日本を話しています。"], ["日本語を話すことを注文するのはやめてほしい。"]];

bot.on('message', msg=>{

  var args = msg.content.substring(PREFIX.length).split(" ");

  switch (args[0]){
    case 'yeet':
      msg.reply('yote');
    break;

    case 'speakjapanese':
      var someval = Math.floor(Math.random() * 100);
      var sentence = someval % 3;
      msg.reply(jap_sentence[sentence]);
    break;

    case 'r6meme':
      image(msg, 'rainbow six siege memes');
    break;

    case 'img':
      args.shift();
      var search = args.join(" ");
      image(msg, search);
    break;

    case 'play':

      function play(connection, message){
        var server = servers[message.guild.id];

        server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));

        server.queue.shift();

        server.dispatcher.on("finish", function(){ // END EVENT NOT TRIGGERING WHY?

          message.channel.send("Song Has Ended.");

          if (server.queue[0]){
            play(connection, message);
          }
          else{
            connected = false;
            connection.disconnect();
          }
        })
      }

      if (!args[1]){
        msg.channel.send("Provide a link stupid.")
      }

      if(!msg.member.voice.channel){
        msg.channel.send("Where are you ah? Join channel stuped!");
        return;
      }

      if (!servers[msg.guild.id]) servers[msg.guild.id] = {
        queue: []
      }

      var server = servers[msg.guild.id];

      server.queue.push(args[1]);
      /*****/
      if (connected == false) msg.member.voice.channel.join().then(function(connection){
        connected = true;
        play(connection, msg);

      })

    break;

    /*case 'queue':
      var server = servers[msg.guild.id];
      if ()*/

    case 'skip':
      var server = servers[msg.guild.id];
      msg.channel.send("Trash song has been skipped.");
      if(server.dispatcher) server.dispatcher.end();
    break;

    case 'stop':
      connected = false;

      var server = servers[msg.guild.id];

      for (var i = server.queue.length - 1; i >= 0; i--){
        server.queue.splice(i, 1);
      }
      server.dispatcher.end();

      if (msg.member.voice.channel){
        msg.member.voice.channel.join().then(function(connection){
            connection.disconnect();
            msg.channel.send("See you n00bs later.");
        });

      }

      /*if (msg.guild.voiceConnection){  error here

        for (var i = server.queue.length - 1; i >= 0; i--){
          server.queue.splice(i, 1);
        }
        server.dispatcher.end();
        msg.channel.send("Queue has been halted. See you n00bs later.");
        console.log('Queue has been halted');
      }

      if (msg.guild.connection) msg.guild.voiceConnection.disconnect();*/

    break;

    case 'truth':
      var value = Math.ceil(Math.random() * 100);
      console.log(value);

      if (value % 2 == 0){
        msg.channel.send("Yes");
      }
      else{
        msg.channel.send("No");
      }

  }

  if(msg.content === "Hey yeetbot"){
    msg.reply('Hey guys wanna see my cat?');
  }
  if (msg.content === "whats the weather today?"){
    msg.reply('Cloudy with a chance of fuck you.')
  }

  if (msg.content === "N-"){
    msg.reply("I see what you're trying to do there and I will not be fooled by such trivial traps");
  }

  if (msg.content === "yeetbot you're the second coolest bot, just behind joebot."){
    msg.reply("Who's Joe?");
  }
  if (msg.content === "JOEMAMA"){
    msg.channel.send("*yeetbot has left the server*");
  }

});


function image(message, searchitem){
  var options = {
    url: "http://results.dogpile.com/serp?qc=images&q=" + searchitem,
    method: "GET",
    headers: {
      "Accept": "text/html",
      "User-Agent": "Chrome"
    }
  };

  request(options, function(error, response, responseBody){
       if (error) {
           return;
       }

       $ = cheerio.load(responseBody);
       var links = $(".image a.link");

       var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));

       console.log(urls);

       if (!urls.length) {
           return;
       }

       message.channel.send(urls[Math.floor(Math.random() * urls.length)]);
    });
}


bot.login(token);
