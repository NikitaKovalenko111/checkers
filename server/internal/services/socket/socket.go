package socketService

import (
	"fmt"
	"sync"

	socketio "github.com/googollee/go-socket.io"
)

type SocketService struct {
	SocketMap *sync.Map
	Io        *socketio.Server
}

func Init(socketMap *sync.Map, io *socketio.Server) *SocketService {
	return &SocketService{
		SocketMap: socketMap,
		Io:        io,
	}
}

func (s *SocketService) FindUserSocket(userId int) (*socketio.Conn, error) {
	var conn socketio.Conn

	value, ok := s.SocketMap.Load(userId)

	if !ok {
		return nil, fmt.Errorf("socket connection is not found")
	}

	if conn, ok = value.(socketio.Conn); !ok {
		return nil, fmt.Errorf("wrong type of socket")
	}

	return &conn, nil
}
