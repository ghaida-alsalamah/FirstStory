import './style.css';

const experiences=[
 {id:'school',color:'#EF453D',title:'First day at school',ar:'أول يوم في المدرسة',kind:'school'},
 {id:'flight',color:'#FFD336',title:'First airplane flight',ar:'أول رحلة بالطائرة',kind:'plane'},
 {id:'dentist',color:'#63B84D',title:'Dentist visit',ar:'زيارة طبيب الأسنان',kind:'tooth'},
 {id:'haircut',color:'#EF453D',title:'First haircut',ar:'قصة الشعر الأولى',kind:'scissors'},
 {id:'home',color:'#FFD336',title:'Moving to a new home',ar:'الانتقال إلى منزل جديد',kind:'home'},
 {id:'pet',color:'#63B84D',title:'Getting a new pet',ar:'حيوان أليف جديد',kind:'pet'},
 {id:'baby',color:'#EF453D',title:'New baby sibling',ar:'مولود جديد في العائلة',kind:'baby'},
 {id:'sleepover',color:'#FFD336',title:'First night away',ar:'أول ليلة بعيداً عن المنزل',kind:'moon'},
 {id:'other',color:'#63B84D',title:'Something else',ar:'تجربة أخرى',kind:'star'}
];

const state={
  step:1,
  experience:'flight',
  customExperience:'',
  language:'English',
  name:'',
  age:'6',
  concern:'',
  interest:'',
  page:0,
  paused:false,
  loading:false,
  story:null
};

const API_URL='http://127.0.0.1:8000/generate';

const app=document.querySelector('#app');

const esc=(v='')=>String(v).replace(
  /[&<>"']/g,
  x=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#039;'
  }[x])
);

const art={
 school:'<path fill="#FFD336" stroke="#173A65" stroke-width="5" d="M19 42 50 18l31 24v39H19z"/><path fill="#EF453D" d="M13 40h74L50 12z"/><path fill="#FFF8E7" stroke="#173A65" stroke-width="4" d="M40 53h20v28H40z"/><circle fill="#2389ED" cx="29" cy="58" r="7"/><circle fill="#2389ED" cx="71" cy="58" r="7"/>',

 plane:'<path fill="#FFF8E7" stroke="#173A65" stroke-width="5" d="M11 53c0-7 8-10 17-9l18 2 20-28c4-6 12-3 10 5L67 48l17 3c10 2 10 12 0 14l-17 3 9 16c2 7-6 10-10 5L46 70l-18 2c-10 1-17-3-17-10z"/><path fill="#EF453D" d="m73 51 15 3c7 2 7 7 0 9l-15 2z"/><circle fill="#2389ED" cx="53" cy="56" r="4"/><circle fill="#2389ED" cx="63" cy="58" r="4"/>',

 tooth:'<path fill="#FFF8E7" stroke="#173A65" stroke-width="5" d="M22 22c12-10 21 0 28 0s16-10 28 0c16 13 3 35-2 50-5 14-14 19-19 2l-4-17c-1-5-5-5-6 0l-4 17c-5 17-14 12-19-2-5-15-18-37-2-50z"/><path fill="none" stroke="#2389ED" stroke-width="4" d="M37 37c6 6 20 6 26 0"/>',

 scissors:'<circle fill="#EF453D" stroke="#173A65" stroke-width="5" cx="26" cy="72" r="15"/><circle fill="#FFD336" stroke="#173A65" stroke-width="5" cx="74" cy="72" r="15"/><path fill="#FFF8E7" stroke="#173A65" stroke-width="5" d="m36 61 37-46c4-5 9 0 6 5L60 53l-9 12zM64 61 27 15c-4-5-9 0-6 5l19 33 9 12z"/>',

 home:'<path fill="#FFF8E7" stroke="#173A65" stroke-width="5" d="M18 45 50 18l32 27v39H18z"/><path fill="#EF453D" stroke="#173A65" stroke-width="5" d="M10 48 50 13l40 35-8 8-32-27-32 27z"/><path fill="#FFD336" stroke="#173A65" stroke-width="4" d="M42 57h17v27H42z"/>',

 pet:'<path fill="#FFD336" stroke="#173A65" stroke-width="5" d="M24 32 13 13c18-2 24 9 25 15 8-4 16-4 24 0 1-6 7-17 25-15L76 32c8 8 10 19 7 32-5 20-61 20-66 0-3-13-1-24 7-32z"/><circle cx="37" cy="49" r="5" fill="#173A65"/><circle cx="65" cy="49" r="5" fill="#173A65"/><path fill="#EF453D" d="M45 62q6-7 12 0-6 9-12 0"/>',

 baby:'<circle fill="#FFF8E7" stroke="#173A65" stroke-width="5" cx="50" cy="54" r="31"/><path fill="#FFD336" stroke="#173A65" stroke-width="4" d="M40 26c-2-13 16-17 20-4 2 8-8 11-14 7"/><circle fill="#173A65" cx="38" cy="51" r="4"/><circle fill="#173A65" cx="62" cy="51" r="4"/><path fill="none" stroke="#EF453D" stroke-width="4" d="M42 65q8 7 16 0"/>',

 moon:'<path fill="#FFD336" stroke="#173A65" stroke-width="5" d="M70 78A36 36 0 1 1 50 12c-17 22-8 54 20 66z"/><path fill="#FFF8E7" d="m72 17 3 8 8 3-8 3-3 8-3-8-8-3 8-3z"/>',

 star:'<path fill="#FFD336" stroke="#173A65" stroke-width="5" stroke-linejoin="round" d="m50 10 11 25 27 3-20 18 6 27-24-14-24 14 6-27-20-18 27-3z"/>'
};

const icon=(kind,cls='')=>`
<svg class="toy-icon ${cls}" viewBox="0 0 100 100" aria-hidden="true">
  ${art[kind]}
</svg>
`;

function clouds(extra=''){
  return `
  <div class="sky-decor ${extra}" aria-hidden="true">
    <div class="cloud cloud-a"><i></i><i></i><i></i></div>
    <div class="cloud cloud-b"><i></i><i></i><i></i></div>
    <div class="cloud cloud-c"><i></i><i></i><i></i></div>
    <span class="twinkle t1">★</span>
    <span class="twinkle t2">★</span>
    <span class="twinkle t3">★</span>
  </div>`;
}

function topbar(){
  return `
  <header class="topbar">
    <button class="mini-brand" data-go="1">
      ★ <span>My First Story</span>
    </button>

    <button
      id="motionToggle"
      class="motion-toggle"
      aria-pressed="${state.paused}"
    >
      ${state.paused?'▶ Play':'Ⅱ Pause'} animation
    </button>
  </header>`;
}

function progress(){
  return `
  <div class="progress">
    ${['Start','Choose','Make it yours','Read']
      .map((x,i)=>`
        <span class="${state.step===i+1?'on':''} ${state.step>i+1?'done':''}">
          <b>${state.step>i+1?'✓':i+1}</b>
          <small>${x}</small>
        </span>
      `)
      .join('')}
  </div>`;
}

function bookSvg(){
  return `
  <div class="magic-book" aria-hidden="true">
    <div class="book-shadow"></div>
    <div class="book-back"></div>

    <div class="pages">
      <div class="page page-3"></div>
      <div class="page page-2"></div>
      <div class="page page-1"><span>★</span></div>
    </div>

    <div class="book-cover">
      <div class="cover-frame">
        <b>★</b>
        <i>Once upon<br>a time…</i>
      </div>
    </div>
  </div>`;
}

function rocket(){
  return `
  <div class="rocket-orbit" aria-hidden="true">
    <svg class="rocket" viewBox="0 0 90 120">
      <path class="flame f2" fill="#EF453D" d="M39 94q6 28 12 0"/>
      <path class="flame" fill="#FFD336" d="M43 91q3 22 7 0"/>

      <path
        fill="#FFF8E7"
        stroke="#173A65"
        stroke-width="5"
        d="M28 72C27 40 35 18 47 7c13 13 20 35 17 65L47 94z"
      />

      <circle
        fill="#2389ED"
        stroke="#173A65"
        stroke-width="4"
        cx="47"
        cy="43"
        r="11"
      />

      <path
        fill="#EF453D"
        stroke="#173A65"
        stroke-width="4"
        d="M29 61 14 80l18-4M63 61l15 20-17-5"
      />
    </svg>
  </div>`;
}

function landing(){
  return `
  <main class="toy-world landing">
    ${clouds()}
    ${topbar()}

    <button class="lang-bubble" id="languageToggle">
      ${state.language==='English'?'عربي':'English'}
    </button>

    <section class="landing-scene">

      <h1 class="big-title">
        <span class="ar-title">قصتي الأولى</span>
        <span class="en-title">My First Story</span>
      </h1>

      <div class="book-stage">
        ${bookSvg()}
        ${rocket()}
        <div class="block block-a">A</div>
        <div class="block block-b">★</div>
        <div class="block block-c">ب</div>
      </div>

      <button class="start-btn" data-go="2">
        <span>
          ${state.language==='Arabic'?'اصنع قصتك':'Make your story'}
        </span>

        <svg viewBox="0 0 70 50">
          <path
            fill="#FFF8E7"
            stroke="#173A65"
            stroke-width="4"
            d="M5 27 44 11l-7 13 24 3-25 6 4 12z"
          />
        </svg>
      </button>

      <p class="tiny-note">A little story for a big first</p>

    </section>
  </main>`;
}

function choose(){
  return `
  <main class="toy-world flow-world">

    ${clouds('soft')}
    ${topbar()}

    <section class="panel-wrap">

      ${progress()}

      <div class="screen-title">
        <span>STEP TWO</span>
        <h1>What’s the next adventure?</h1>
        <p>Pick one toy to begin.</p>
      </div>

      <div class="toy-grid">
        ${experiences.map(e=>`
          <button
            class="toy-card ${state.experience===e.id?'selected':''}"
            data-exp="${e.id}"
            style="--toy:${e.color}"
          >

            ${icon(e.kind)}

            <b>
              ${state.language==='Arabic'?e.ar:e.title}
            </b>

            <i class="select-pop">✓</i>
          </button>
        `).join('')}
      </div>

      <div class="actions">
        <button class="back-btn" data-go="1">← Back</button>
        <button class="yellow-btn" id="toPersonalize">
          Next: make it theirs →
        </button>
      </div>

    </section>
  </main>`;
}

function personalize(){

  const e=experiences.find(x=>x.id===state.experience);

  return `
  <main class="toy-world flow-world">

    ${clouds('soft')}
    ${topbar()}

    <section class="panel-wrap notebook-wrap">

      ${progress()}

      <div class="notebook">

        <div class="rings">
          ${'<i></i>'.repeat(7)}
        </div>

        <div class="screen-title">
          <span>STEP THREE</span>
          <h1>Tell us about your little star</h1>
          <p>Just a few details make the story feel like theirs.</p>
        </div>

        <form id="storyForm">

          <div class="chosen-toy">

            ${icon(e.kind)}

            <span>
              <small>THE STORY</small>

              <b>
                ${state.language==='Arabic'?e.ar:e.title}
              </b>
            </span>

            <button type="button" data-go="2">
              Change
            </button>

          </div>

          ${
            state.experience==='other'
            ? `
              <label class="wide">
                What’s the new experience?

                <input
                  name="customExperience"
                  required
                  value="${esc(state.customExperience)}"
                  placeholder="Joining a football team"
                >
              </label>
            `
            :''
          }

          <div class="field-grid">

            <label>
              Child’s name <em>*</em>

              <input
                name="name"
                required
                maxlength="30"
                value="${esc(state.name)}"
                placeholder="Layan"
              >
            </label>

            <label>
              Age <em>*</em>

              <select name="age">

                ${[4,5,6,7,8,9].map(n=>`
                  <option ${state.age==n?'selected':''}>
                    ${n}
                  </option>
                `).join('')}

              </select>
            </label>

            <label>
              What are they worried about?
              <small>Optional</small>

              <input
                name="concern"
                maxlength="80"
                value="${esc(state.concern)}"
                placeholder="Loud noises"
              >
            </label>

            <label>
              What do they love?
              <small>Optional</small>

              <input
                name="interest"
                maxlength="80"
                value="${esc(state.interest)}"
                placeholder="Space and planets"
              >
            </label>

          </div>

          <fieldset>

            <legend>Story language</legend>

            <label>
              <input
                type="radio"
                name="language"
                value="English"
                ${state.language==='English'?'checked':''}
              >

              <span>ABC</span>
              English
            </label>

            <label>
              <input
                type="radio"
                name="language"
                value="Arabic"
                ${state.language==='Arabic'?'checked':''}
              >

              <span>أبج</span>
              العربية
            </label>

          </fieldset>

          <div class="actions">

            <button
              type="button"
              class="back-btn"
              data-go="2"
            >
              ← Back
            </button>

            <button
              class="yellow-btn"
              type="submit"
            >
              Create the magic ★
            </button>

          </div>

        </form>

      </div>

    </section>
  </main>`;
}

function loading(){
  return `
  <main class="toy-world loading-world">

    ${clouds()}
    ${topbar()}

    <section class="loading-box">

      ${bookSvg()}

      <h1>Gathering the story’s pages…</h1>

      <p>
        Adding a little courage and a sprinkle of magic.
      </p>

      <div class="loading-dots">
        <i></i>
        <i></i>
        <i></i>
      </div>

    </section>

  </main>`;
}

function buildStory(){
  return state.story;
}

function reader(){

  const s=buildStory();

  const e=experiences.find(
    x=>x.id===state.experience
  );

  const rtl=state.language==='Arabic';

  return `
  <main class="toy-world reader-world ${rtl?'rtl':''}">

    ${clouds('calm')}
    ${topbar()}

    <section class="reader-shell">

      <div class="reader-title">

        <small>
          ${
            state.language==='Arabic'
            ?'قصة صنعت خصيصاً لك'
            :'A STORY MADE JUST FOR YOU'
          }
        </small>

        <h1>${s.title}</h1>

      </div>

      <div class="open-book">

        <div class="binding"></div>

        <div class="illustration-page">

          <span class="scene-sun"></span>

          ${icon(e.kind,'story-toy')}

          <span class="hill h1"></span>
          <span class="hill h2"></span>

          <i>★</i>

        </div>

        <div class="text-page">

          <small>
            PAGE ${state.page+1} / ${s.pages.length}
          </small>

          <p>
            ${s.pages[state.page]}
          </p>

          <div class="page-stars">
            ★ · ★
          </div>

        </div>

      </div>

      <div class="reader-bar">

        <button
          id="prev"
          class="round-btn"
          ${state.page===0?'disabled':''}
        >
          ←
        </button>

        <div class="page-dots">

          ${s.pages.map((_,i)=>`
            <button
              data-page="${i}"
              class="${i===state.page?'on':''}"
              aria-label="Page ${i+1}"
            ></button>
          `).join('')}

        </div>

        <button
          id="soundBtn"
          class="audio-btn"
        >
          ▶

          <span>
            ${
              state.language==='Arabic'
              ?'استمع'
              :'Listen'
            }
          </span>

        </button>

        ${
          state.page<s.pages.length-1
          ?`
            <button
              id="next"
              class="round-btn"
            >
              →
            </button>
          `
          :`
            <button
              data-go="1"
              class="yellow-btn small"
            >
              New story ★
            </button>
          `
        }

      </div>

    </section>

  </main>`;
}

function render(){

  if('speechSynthesis' in window){
    speechSynthesis.cancel();
  }

  app.className=
    state.paused
    ?'paused'
    :'';

  app.innerHTML=
    state.loading
    ?loading()
    :state.step===1
      ?landing()
      :state.step===2
        ?choose()
        :state.step===3
          ?personalize()
          :reader();

  bind();

  window.scrollTo({
    top:0,
    behavior:'smooth'
  });
}

function bind(){

  document.querySelectorAll('[data-go]')
    .forEach(b=>b.onclick=()=>{

      state.step=+b.dataset.go;
      state.page=0;

      if(state.step===1){
        state.story=null;
      }

      render();
    });

  document.querySelectorAll('[data-exp]')
    .forEach(b=>b.onclick=()=>{

      state.experience=b.dataset.exp;

      b.classList.add('react');

      setTimeout(
        render,
        240
      );
    });

  document.querySelectorAll('[data-page]')
    .forEach(b=>b.onclick=()=>{

      state.page=+b.dataset.page;

      render();
    });

  const m=
    document.querySelector('#motionToggle');

  if(m){
    m.onclick=()=>{

      state.paused=!state.paused;

      render();
    };
  }

  const l=
    document.querySelector('#languageToggle');

  if(l){
    l.onclick=()=>{

      state.language=
        state.language==='English'
        ?'Arabic'
        :'English';

      render();
    };
  }

  const n=
    document.querySelector('#toPersonalize');

  if(n){
    n.onclick=()=>{

      state.step=3;

      render();
    };
  }

  const f=
    document.querySelector('#storyForm');

  if(f){

    f.onsubmit=async e=>{

      e.preventDefault();

      const d=new FormData(f);

      [
        'name',
        'age',
        'concern',
        'interest',
        'language',
        'customExperience'
      ].forEach(
        k=>state[k]=d.get(k)||''
      );

      const selectedExperience=
        experiences.find(
          x=>x.id===state.experience
        );

      const experience=
        state.experience==='other'
        ?state.customExperience
        :state.language==='Arabic'
          ?selectedExperience.ar
          :selectedExperience.title;

      state.loading=true;

      render();

      try{

        const response=
          await fetch(
            API_URL,
            {
              method:'POST',

              headers:{
                'Content-Type':'application/json'
              },

              body:JSON.stringify({
                name:state.name,
                age:Number(state.age),
                experience:experience,
                concern:state.concern,
                interest:state.interest,
                language:state.language
              })
            }
          );

        if(!response.ok){

          const message=
            await response.text();

          throw new Error(
            `Story generation failed (${response.status}): ${message}`
          );
        }

        const story=
          await response.json();

        if(
          !story ||
          typeof story.title!=='string' ||
          !Array.isArray(story.pages) ||
          story.pages.length===0
        ){
          throw new Error(
            'The backend returned an invalid story format.'
          );
        }

        state.story=story;

        state.loading=false;
        state.step=4;
        state.page=0;

        render();

      }catch(error){

        console.error(error);

        state.loading=false;
        state.step=3;

        render();

        alert(
          'Could not generate the story. Make sure the backend is running, then try again.'
        );
      }
    };
  }

  const p=
    document.querySelector('#prev');

  if(p){
    p.onclick=()=>{

      speechSynthesis.cancel();

      state.page--;

      render();
    };
  }

  const nx=
    document.querySelector('#next');

  if(nx){
    nx.onclick=()=>{

      speechSynthesis.cancel();

      state.page++;

      render();
    };
  }

  const snd=
    document.querySelector('#soundBtn');

  if(snd){

    snd.onclick=()=>{

      speechSynthesis.cancel();

      const story=buildStory();

      if(!story){
        return;
      }

      const u=
        new SpeechSynthesisUtterance(
          story.pages[state.page]
        );

      u.lang=
        state.language==='Arabic'
        ?'ar-SA'
        :'en-US';

      speechSynthesis.speak(u);

      snd.classList.add('playing');

      u.onend=
      u.onerror=
        ()=>snd.classList.remove('playing');
    };
  }
}

render();