import '../style.css'
import { setupCounter } from './counter.js'


let tasks = [];

function formatTime(hourFloat) {
  const touteslMinutes = Math.round(hourFloat * 60);
  const hh = Math.floor(touteslMinutes / 60) % 24;
  const mm = touteslMinutes % 60;
  return `${hh.toString().padStart(2,'0')}h${mm.toString().padStart(2,'0')}`;
}

async function fetchTasks() {
  try {
    const res = await fetch('http://localhost:5000/tasks');
    if (!res.ok) throw new Error('Erreur réseau');// Récupération des tâches depuis le backend
    tasks = await res.json();
    renderTasks(tasks);
  } catch (error) {
    console.error('Erreur récupération des tâches:', error);// Vous pouvez afficher un message d'erreur à l'utilisateur ici
  }
}

function renderTasks(list) {
  const taskList = document.getElementById('taskList');
  if (!taskList) return;// Vérification de l'existence de l'élément
  taskList.innerHTML = '';
  list.sort((a, b) => getPriorityScore(b.priorite) - getPriorityScore(a.priorite));
  list.forEach(taskObj => {
    const li = document.createElement('li');
    li.textContent = `${taskObj.nom} - Durée: ${taskObj.duree}h - Priorité: ${taskObj.priorite}`;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.addEventListener('click', async () => {
      try {
        const res = await fetch(`http://localhost:5000/tasks/${taskObj.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Échec suppression');
        await fetchTasks();
      } catch (err) {
        console.error('Erreur suppression:', err);
      }
    });
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

const getPriorityScore = (priorite) => {
  if (!priorite) return 0;
  switch (priorite.toLowerCase()) {
    case 'haute': return 3;
    case 'moyenne': return 2;
    case 'basse': return 1;
    default: return 0;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const counterEl = document.querySelector('#counter');
  if (counterEl) setupCounter(counterEl);

  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const taskDuration = document.getElementById('taskDuration');
  const taskPriority = document.getElementById('taskPriority');

  if (!taskForm) {
    console.error('taskForm introuvable dans le DOM.');
    return;
  }

  fetchTasks();

  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const task = taskInput.value.trim();
    const duration = taskDuration.value;
    const priority = taskPriority.value;
    if (!task || !duration || !priority) return;
    try {
      const res = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: task, duree: parseInt(duration, 10), priorite: priority })
      });
      if (!res.ok) throw new Error('Erreur ajout');
      await fetchTasks();
      taskForm.reset();
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la tâche au backend:', err);
    }
  });

  const generateScheduleBtn = document.getElementById('generateSchedule');
  const scheduleList = document.getElementById('scheduleList');

  if (generateScheduleBtn && scheduleList) {
    generateScheduleBtn.addEventListener('click', async () => {
      try {
        const res = await fetch('http://localhost:5000/schedule');
        if (!res.ok) throw new Error('Erreur récupération du planning');
        const schedule = await res.json();
        renderSchedule(schedule);
      } catch (err) {
        console.error('Erreur génération du planning:', err);
      }
    });
  }
});

function renderSchedule(schedule) {
  const scheduleList = document.getElementById('scheduleList');
  if (!scheduleList) return;
  scheduleList.innerHTML = '';
  schedule.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nom} (${item.priorite}) — ${item.start} à ${item.end}`;
    scheduleList.appendChild(li);
  });
}
