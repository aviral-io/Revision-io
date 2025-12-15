document.addEventListener('DOMContentLoaded', () => {
    const lectureForm = document.getElementById('lecture-form');
    const pendingList = document.getElementById('pending-list');
    const completedList = document.getElementById('completed-list');
    
    let revisions = JSON.parse(localStorage.getItem('revisions')) || [];

    lectureForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const subject = document.getElementById('subject').value;
        const topic = document.getElementById('topic').value;
        const lectureDate = document.getElementById('date').value;

        const days = 1; 

        const revDate = new Date(lectureDate);
        revDate.setDate(revDate.getDate() + days);

        const revisionTask = {
            id: Date.now(), 
            subject,
            topic,
            lectureDate: lectureDate, 
            dueDate: revDate.toISOString().split('T')[0],
            dayInterval: days,
            completed: false
        };

        revisions.push(revisionTask);
        
       

        localStorage.setItem('revisions', JSON.stringify(revisions));
        lectureForm.reset();
        renderTasks();
    });

    function renderTasks() {
        pendingList.innerHTML = '';
        completedList.innerHTML = '';
        let completedCount = 0;

        revisions.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        

        revisions.forEach(task => {
            const item = document.createElement('div');
            item.className = 'revision-item';
            
            const html = `
                <div class="item-info">
                    <h4>${task.subject}: ${task.topic}</h4>
                    <p>Due: <strong>${task.dueDate}</strong></p>
                </div>
                ${!task.completed ? `<button class="done-btn" onclick="markDone(${task.id})">Mark Revised</button>` : '<span>✅</span>'}
            `;
            
            item.innerHTML = html;

            if (task.completed) {
                completedList.appendChild(item);
                completedCount++;
            } else {
                pendingList.appendChild(item);
            }
          
    const clearBtn = document.getElementById('clear-btn');

    clearBtn.addEventListener('click', () => {
        
        localStorage.removeItem('revisions');
        
        revisions = [];
        
      
        renderTasks();
    });

   
        });

    
        document.getElementById('pending-count').innerText = revisions.filter(t => !t.completed).length;
        const percent = revisions.length ? Math.round((completedCount / revisions.length) * 100) : 0;
        document.getElementById('completion-rate').innerText = percent + '%';
    }

    window.markDone = (id) => {
        revisions = revisions.map(task => {
            if (task.id === id) {
                task.completed = true;
                
               
            }
            return task;
        });
        localStorage.setItem('revisions', JSON.stringify(revisions));
        renderTasks();
    };

    
    function scheduleNext(prevTask, nextInterval) {
        const revDate = new Date(prevTask.lectureDate);
        revDate.setDate(revDate.getDate() + nextInterval);
        
        const newTask = {
            id: Date.now(),
            subject: prevTask.subject,
            topic: prevTask.topic,
            lectureDate: prevTask.lectureDate,
            dueDate: revDate.toISOString().split('T')[0],
            dayInterval: nextInterval,
            completed: false
        };
        revisions.push(newTask);
    }

    renderTasks();
});