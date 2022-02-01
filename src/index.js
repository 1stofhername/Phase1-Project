let eventCreate = false

document.addEventListener('DOMContentLoaded', ()=> {
    const improveBtn = document.querySelector('#improve-community-btn');
    const eventFormContainer = document.querySelector('div.container#event');

    improveBtn.addEventListener('click', () => {
        eventCreate = !eventCreate;
        if (eventCreate) {
            eventFormContainer.style.display = 'block';
            improveBtn.innerHTML = 'Hide event form';
        } else {
            eventFormContainer.style.display = 'none';
            improveBtn.innerHTML = 'Engage your community!';
            

        }
    });
    submitHandler();
    fetchPost();
    
   
});


const submitHandler = ()=>{
    const form = document.getElementById('event-form');
    form.addEventListener('submit', (e)=>{
        let title = e.target['event-title'].value;
        let facilitator = e.target['facilitator'].value;
        let image = e.target['image'].value;
        let goals = e.target['goals'].value;
        let date = e.target['event-date'].value;
        let startTime = e.target['start-time'].value;
        let startTimeAmPm = e.target['start-time-am-pm'].value;
        let endTime = e.target['end-time'].value;
        let endTimeAmPm = e.target['end-time-am-pm'].value;

        e.preventDefault();

        const formData = new Post (title, facilitator, image, goals, date, startTime, startTimeAmPm, endTime, endTimeAmPm);
        formData.postData();
        form.reset();
    });
}

class Post {
    constructor(title, facilitator, image, goals, date, startTime, startTimeAmPm, endTime, endTimeAmPm){
        this.title = title;
        this.facilitator = facilitator;
        this.image = image;
        this.goals = goals;
        this.date = date;
        this.startTime = startTime+startTimeAmPm;
        this.endTime = endTime+endTimeAmPm;
        this.participants = 0;   
    }
    postData(){
        fetch('http://localhost:3000/posts', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/JSON',
                'Accept' : 'application/JSON'
            },
            body : JSON.stringify(this)
        }).then(res=>res.json())
        .then(data=>postRenderer(data))

    }
}


const fetchPost = function (){
    fetch('http://localhost:3000/posts')
            .then((res)=>res.json())
            .then(postData=>postData.forEach(post => postRenderer(post)))
        }


const postRenderer = function (postObj) {
    const postCollection = document.querySelector('#post-container');
    const card = document.createElement('div');
    const img = document.createElement('img');
    const h2 = document.createElement('h2');
    const p = document.createElement('p');
    const attendBtn = document.createElement('button');
    const attendeeCnt = document.createElement('p');

    postCollection.appendChild(card);
    card.classList.add('post-card');
    card.append(h2,img,p,attendeeCnt,attendBtn);
    card.setAttribute('id', `${postObj.id}`);

    h2.innerHTML = postObj.title;
    p.innerHTML = postObj.goals;
    attendBtn.innerHTML = 'Participate!';
    attendeeCnt.innerHTML = postObj.participants+' community members participating';
    img.src = postObj.image;

    h2.classList.add('card-title');
    p.classList.add('card-text')
    attendBtn.setAttribute('id', 'card-btn');
    attendeeCnt.classList.add('attendee-count');
    img.classList.add('card-img');
    
    attendBtn.addEventListener('click', (e)=>{
        let newAttendeeCnt = postObj.participants +=1
      fetch(`http://localhost:3000/posts/${card.id}`, {
        method : 'PATCH',
        headers : {
          'Content-Type' : 'application/JSON',
          'Accept' : 'application/JSON'
        },
        body : JSON.stringify({
          'participants' : newAttendeeCnt
        })
      }).then(res=>res.json())
      .then(data=>{attendeeCnt.innerHTML = data.participants+' community members participating'
    })
      
      })
    
    
}
