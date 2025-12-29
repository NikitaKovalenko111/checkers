package queue

type Queue struct {
	QueueArray [1]int
}

func (queue *Queue) Init() {
	queue.QueueArray[0] = -1
}

func (queue *Queue) Add(id int) int {
	if queue.QueueArray[0] == -1 {
		queue.QueueArray[0] = id

		return 1
	} else {
		return 0
	}
}

func (queue *Queue) Read() int {
	var id int

	if queue.QueueArray[0] != -1 {
		id = queue.QueueArray[0]
		queue.QueueArray[0] = -1
	}

	return id
}
