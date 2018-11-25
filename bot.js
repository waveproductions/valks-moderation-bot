const Discord = require('discord.js');
const client = new Discord.Client();
const tokens = require('./tokens.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.channels.get("515687586732441610").send({
    embed: {
      color: 0xb1ff9e,
      author: {
        name: `${client.user.username} sucessfully updated!`
      },
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: client.user.id
      }
    }
  });
});

client.on('presenceUpdate', (oldMember, newMember) => {
  if (newMember.user.id != '453640548985602048') return;
  if (newMember.presence.game == null) return;
  let streaming = newMember.presence.game.streaming;
  if (streaming) {
    let followerRole = newMember.guild.roles.find(val => val.name === 'Follower');
    newMember.guild.channels.get("514315299584081931").send(followerRole.toString(), {
      embed: {
        author: {
          name: `${newMember.user.username}'s is now streaming!`
        },
        color: 0xff96f6,
        thumbnail: {
          url: newMember.user.avatarURL
        },
        description: `${newMember.presence.game.url}`,
        timestamp: new Date(),
        footer: {
          icon_url: newMember.user.avatarURL,
          text: newMember.presence.game.name
        }
      }
    });
  }
});

client.on('guildMemberAdd', (member) => {
  let role = member.guild.roles.find(val => val.name === 'a cat');
  member.addRole(role);

  client.channels.get("513256961656225792").send({
    embed: {
      author: {
        name: `${member.user.username}`
      },
      color: 0xff96f6,
      thumbnail: {
        url: member.user.avatarURL
      },
      description: 'Welcome!',
      timestamp: new Date(),
      footer: {
        icon_url: member.user.avatarURL,
        text: member.id
      }
    }
  }).then(m => {
    m.delete(30000)
  });
});

client.on('guildBanAdd', (guild, user) => {
  let reason;
  guild.fetchAuditLogs().then(audit => {
    reason = audit.entries.first().reason;
  });
  client.channels.get("515687586732441610").send({
    embed: {
      author: {
        name: `${user.username} was banned.`
      },
      color: 0xff4d4d,
      description: reason ? reason : 'No reason specified.',
      timestamp: new Date(),
      footer: {
        icon_url: user.avatarURL,
        text: user.id
      }
    }
  });
});

client.on('messageDelete', msg => {
  if (msg.author.bot) return; // We don't want the bot reacting to itself..
  if (msg.member.hasPermission('MANAGE_MESSAGES')) return;
  client.channels.get("516030759493042179").send({
    embed: {
      author: {
        name: `${msg.author.username} deleted a message.`
      },
      description: msg.content,
      timestamp: new Date(),
      footer: {
        icon_url: msg.author.avatarURL,
        text: msg.author.id
      }
    }
  });
});

client.on('messageUpdate', (oldMessage, newMessage) => {
  if (oldMessage.author.bot) return; // We don't want the bot reacting to itself..
  if (oldMessage.member.hasPermission('MANAGE_MESSAGES')) return;
  client.channels.get("516030759493042179").send({
    embed: {
      author: {
        name: `${oldMessage.author.username} edited a message.`
      },
      fields: [{
          name: "Old",
          value: oldMessage.content,
          inline: true
        },
        {
          name: "New",
          value: newMessage.content,
          inline: true
        }
      ],
      timestamp: new Date(),
      footer: {
        icon_url: oldMessage.author.avatarURL,
        text: oldMessage.author.id
      }
    }
  });
});

client.on('message', msg => {
  if (msg.author.bot) return; // We don't want the bot reacting to itself..

  if (msg.channel.type == 'dm') {
    client.channels.get("515687586732441610").send({
      embed: {
        color: 0xff96f6,
        author: {
          name: `${msg.author.username} sent a message through ${client.user.username} to staff.`
        },
        description: msg.content,
        timestamp: new Date(),
        footer: {
          icon_url: msg.author.avatarURL,
          text: msg.author.id
        }
      }
    });
  }

  if (msg.channel.type != 'text') return;

  if (msg.content === msg.content.toUpperCase() && msg.content.length > 8) {
    msg.guild.channels.get("515687586732441610").send({
      embed: {
        color: 0xff9c2b,
        author: {
          name: `${msg.author.username} is using an excessive amount of caps in #${msg.channel.name}.`
        },
        description: msg.content,
        timestamp: new Date(),
        footer: {
          icon_url: msg.author.avatarURL,
          text: msg.author.id
        }
      }
    });
  }

  if (msg.content.includes('discord.gg/')) {
    msg.guild.channels.get("515687586732441610").send({
      embed: {
        color: 0xff9c2b,
        author: {
          name: `${msg.author.username} posted a invite link in #${msg.channel.name}.`
        },
        description: msg.content,
        timestamp: new Date(),
        footer: {
          icon_url: msg.author.avatarURL,
          text: msg.author.id
        }
      }
    });
  }

  if (msg.content.startsWith(tokens.prefix + 'warn')) {
    warn(msg);
  }

  if (msg.content.startsWith(tokens.prefix + 'follow')) {
    let followerRole = msg.guild.roles.find(val => val.name === 'Follower');
    msg.member.addRole(followerRole);
    msg.channel.send({
      embed: {
        author: {
          name: `Thankyou, ${msg.author.username}!`
        },
        color: 0xff96f6,
        thumbnail: {
          url: 'https://thumbs.gfycat.com/WavyAromaticAmethystsunbird-max-1mb.gif'
        },
        description: 'You\'re now a follower of valkyrienyanko\'s streams!',
        timestamp: new Date(),
        footer: {
          icon_url: msg.author.avatarURL,
          text: msg.author.id
        }
      }
    }).then(m => {
      m.delete(30000);
    });
  }
});

function warn(msg) {
  const args = msg.content.slice(tokens.prefix.length + 'warn'.length).trim().split(/ +/g);
  const reason = msg.content.split(' ').slice(2).join(' ');
  console.log(reason);
  if (!msg.member.hasPermission('MANAGE_MESSAGES')) return msg.channel.send('No perms');
  if (args[0] == undefined) return msg.channel.send('Specify a member.');
  let member;
  let members = msg.guild.members;
  if (msg.mentions.members.size > 0) {
    member = msg.mentions.members.first();
  } else if (isNaN(args[0])) {
    member = members.find(val => val.user.username.toLowerCase() === args[0].toLowerCase());
    if (!member) {
      member = members.find(val => {
        if (val.nickname) val.nickname.toLowerCase() === args[0].toLowerCase()
      });
    }
  } else {
    member = members.find(val => val.user.id === args[0]);
  };
  if (!member) return msg.channel.send('Member does not exist!');

  msg.channel.send(`Warned ${member.user.username}..`).then(m => {
    m.delete(1000);
  });

  msg.guild.channels.get("515687586732441610").send({
    embed: {
      color: 0xff4d4d,
      author: {
        name: `${msg.author.username} issued ${member.user.username} a warning!`
      },
      description: `${reason ? reason : 'No reason specified.'}`,
      timestamp: new Date(),
      footer: {
        icon_url: member.user.avatarURL,
        text: member.id
      }
    }
  });

  member.send({
    embed: {
      color: 0xff4d4d,
      author: {
        name: `You were issued a warning!`
      },
      description: `${reason ? reason : 'No reason specified.'}`,
      timestamp: new Date(),
      footer: {
        icon_url: member.user.avatarURL,
        text: member.id
      }
    }
  });
}

client.login(process.env.BOT_TOKEN);