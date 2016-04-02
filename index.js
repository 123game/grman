var shortid = require('shortid');

module.exports = function(games) {

  var manager = {
    sockets: [],
    games: [],

    socket: function(id) {
      return manager.sockets[id];
    },

    room: function(socket) {
      var game = socket.info.game;
      var room = socket.info.room;
      return manager.games[game].rooms[room];
    },

    join: function(socket) {
      var game = socket.info.game;
      var room = socket.info.room;

      if (!room) {
        if (manager.games[game].rooms.length > 0) {
          var available_rooms = manager.games[game].rooms.filter(function(r) {
            return (r.sockets.length < manager.games[game].room_max);
          });
          if (available_rooms.length > 0) {
            room = available_rooms[Math.floor(Math.random() * available_rooms.length)].id;
          } else {
            room = shortid.generate();
          }
        } else {
          room = shortid.generate();
        }
      }

      var oroom = manager.games[game].rooms[room];

      if (!oroom) {
        oroom = {};
        oroom.game = game;
        oroom.id = room;
        oroom.sockets = {};
        manager.games[game].rooms[room] = oroom;
      }

      oroom.sockets[socket.info.id] = socket.info;
      socket.info.room = room;

      if (!oroom.host) {
        socket.info.is_host = true;
        oroom.host = socket.info.id;
      }
    },

    leave: function(socket) {
      var game = socket.info.game;
      var room = socket.info.room;

      if (room) {
        var oroom = manager.games[game].rooms[room];

        if (oroom) {
          delete oroom.sockets[socket.info.id];

          if (oroom.sockets.length == 0) {
            delete manager.games[game].rooms[room];
          } else if (socket.info.is_host) {
            var assigned = false;
            for (var s in oroom.sockets) {
              if (!assigned) {
                s.is_host = true;
                manager.sockets[s.id].info.is_host = true;
                oroom.host = s.id;
                assigned = true;
              } else {
                s.is_host = false;
                manager.sockets[s.id].info.is_host = false;
              }
            }
          }
        }
        socket.info.is_host = false;
        delete socket.info['room'];
      }
    }
  };

  manager.games = Object.assign({}, games);
  for (var game in manager.games) {
    manager.games[game].rooms = [];
  };
  console.log('Init games: %s', JSON.stringify(games));

  return manager;
};
