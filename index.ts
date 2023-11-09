// src/index.ts
import inquirer from "inquirer";
import * as fs from 'fs';

interface Todo {
  task: string;
  completed: boolean;
}

const todoFilePath = 'todos.json';

const loadTodos = (): Todo[] => {
  try {
    const data = fs.readFileSync(todoFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveTodos = (todos: Todo[]) => {
  fs.writeFileSync(todoFilePath, JSON.stringify(todos, null, 2));
};

const showTodos = () => {
  const todos = loadTodos();
  console.log('\nTodos:\n');
  todos.forEach((todo, index) => {
    const status = todo.completed ? '[x]' : '[ ]';
    console.log(`${index + 1}. ${status} ${todo.task}`);
  });
  console.log('\n');
};

const addTodo = async () => {
  const answer = await inquirer.prompt({
    type: 'input',
    name: 'task',
    message: 'Enter a new task:'
  });

  const todos = loadTodos();
  todos.push({ task: answer.task, completed: false });
  saveTodos(todos);
  console.log('Task added!\n');
};

const toggleTodo = async () => {
  showTodos();

  const answer = await inquirer.prompt({
    type: 'number',
    name: 'index',
    message: 'Enter the number of the task you want to toggle:'
  });

  const todos = loadTodos();
  const index = answer.index - 1;

  if (index >= 0 && index < todos.length) {
    todos[index].completed = !todos[index].completed;
    saveTodos(todos);
    console.log('Task toggled!\n');
  } else {
    console.log('Invalid task number. Please try again.\n');
  }
};

const main = async () => {
  const actions = ['Show Todos', 'Add Todo', 'Toggle Todo', 'Quit'];

  while (true) {
    const answer = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'Choose an action:',
      choices: actions
    });

    switch (answer.action) {
      case 'Show Todos':
        showTodos();
        break;
      case 'Add Todo':
        await addTodo();
        break;
      case 'Toggle Todo':
        await toggleTodo();
        break;
      case 'Quit':
        console.log('Goodbye!');
        process.exit();
        break;
    }
  }
};

main();
