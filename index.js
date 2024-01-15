const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()
const app = express()
const PORT = 8000

const db = process.env.mongodb_url

mongoose
  .connect(db)
  .then(() => console.log('successfully connected'))
  .catch((err) => console.log(err))

const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: String,
  isCompleted: Boolean,
})

const Todo = mongoose.model('Todo', todoSchema)
// Middlewarres
app.use(cors())
app.use(bodyParser.json())

// Routes
app.get('/todos', async (req, res) => {
  let queryParam = {}
  if (req.query.priority) {
    queryParam.priority = req.query.priority
  }
  try {
    const result = await Todo.find(queryParam)
    res.status(201).json(result)
  } catch (error) {
    console.error('Error creating todo:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.post('/todos', async (req, res) => {
  try {
    const { title, priority, description, isCompleted } = req.body

    const newTodo = new Todo({
      title,
      description,
      priority,
      isCompleted,
    })

    // Save the newTodo to the MongoDB database
    const savedTodo = await newTodo.save()

    res.status(201).json(savedTodo)
  } catch (error) {
    console.error('Error creating todo:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})
app.put('/todos/:id', async (req, res) => {
  try {
    const id = req.params.id
    const { isCompleted, priority, title, description } = req.body

    const updatedTodos = await Todo.findByIdAndUpdate(
      id,
      { title, description, priority, isCompleted },
      { new: true }
    )

    res.status(201).json(updatedTodos)
  } catch (error) {
    console.error('Error creating todo:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})
app.patch('/todo/:id', async (req, res) => {
  try {
    const id = req.params.id
    const { title, description, priority } = req.body.todo

        const updatedTodos = await Todo.findByIdAndUpdate(
          id,
          { title, description, priority, },
          { new: true }
        )
        res.status(201).json(updatedTodos)
  } catch (error) {
    console.error('Error creating todo:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})
app.delete('/todo/:id', async (req, res) => {
  try {
    const id = req.params.id
    const result = await Todo.findByIdAndDelete(id)
    res.status(201).json(result)
  } catch (error) {
    console.error('Error creating todo:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('/', (req, res) => {
  return res.send('i am here man don not worry!')
})
app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`))
