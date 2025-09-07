// -----------------------------
// Interactive Form Demo Script
// - Event handling, 2+ interactive features
// - Custom form validation (no HTML5 built-in required fields)
// -----------------------------

// ------- Utilities & selectors -------
const form = document.getElementById('appForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const ageInput = document.getElementById('age');
const msgInput = document.getElementById('message');
const charCount = document.getElementById('charCount');
const charLimit = Number(document.getElementById('charLimit').textContent);
const addSkillBtn = document.getElementById('addSkillBtn');
const skillInput = document.getElementById('skillInput');
const skillsList = document.getElementById('skills');
const previewName = document.getElementById('previewName');
const previewEmail = document.getElementById('previewEmail');
const previewSkills = document.querySelector('.skills-list');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const formResult = document.getElementById('formResult');
const downloadBtn = document.getElementById('downloadBtn');
const themeToggle = document.getElementById('themeToggle');

// store skills in an array (interactive feature 1)
let skills = [];

/* ========================
   Part A: Live preview updates
   - Listen to inputs and update the live preview area
   ======================== */
nameInput.addEventListener('input', () => {
  previewName.textContent = nameInput.value.trim() || 'Your name here';
});

emailInput.addEventListener('input', () => {
  previewEmail.textContent = emailInput.value.trim() || 'your.email@example.com';
});

// When skills change, update previewSkills
function updatePreviewSkills() {
  previewSkills.textContent = skills.length ? skills.join(', ') : 'none';
}

/* ========================
   Part B: Character counter for message box
   - Interactive feature 2: live character count and limit enforcement
   ======================== */
msgInput.addEventListener('input', () => {
  const len = msgInput.value.length;
  charCount.textContent = len;
  if (len > charLimit) {
    charCount.style.color = 'red';
  } else {
    charCount.style.color = '';
  }
});

/* ========================
   Part C: Skills chips add/remove logic
   - Add skill by clicking button or pressing Enter in input
   - Click a chip to remove it
   ======================== */
function renderSkills() {
  skillsList.innerHTML = '';
  skills.forEach((s, idx) => {
    const li = document.createElement('li');
    li.textContent = s;
    li.dataset.index = idx;
    // clicking the chip removes it
    li.addEventListener('click', () => {
      skills.splice(idx, 1);
      renderSkills();
      updatePreviewSkills();
    });
    skillsList.appendChild(li);
  });
}

function addSkillFromInput() {
  const val = skillInput.value.trim();
  if (!val) return;
  // avoid duplicates
  if (!skills.includes(val)) {
    skills.push(val);
    renderSkills();
    updatePreviewSkills();
  }
  skillInput.value = '';
  skillInput.focus();
}

addSkillBtn.addEventListener('click', addSkillFromInput);

// Allow Enter key in skill input to add
skillInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addSkillFromInput();
  }
});

/* ========================
   Part D: Custom form validation (no HTML5-only)
   - Validate fields on submit, give accessible error text.
   ======================== */

// Simple email regex (not exhaustive but practical)
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// clear error helper
function setError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg || '';
}

// validate returns an object {valid: boolean, data: {...}}
function validateForm() {
  let valid = true;
  setError('err-name', '');
  setError('err-email', '');
  setError('err-age', '');
  setError('err-message', '');

  const nameVal = nameInput.value.trim();
  const emailVal = emailInput.value.trim();
  const ageVal = Number(ageInput.value);
  const msgVal = msgInput.value.trim();

  if (!nameVal || nameVal.length < 2) {
    setError('err-name', 'Please enter your full name (at least 2 characters).');
    valid = false;
  }

  if (!emailVal || !isValidEmail(emailVal)) {
    setError('err-email', 'Please enter a valid email address (example@domain.com).');
    valid = false;
  }

  if (!ageInput.value || Number.isNaN(ageVal) || ageVal < 18 || ageVal > 99) {
    setError('err-age', 'Enter an age between 18 and 99.');
    valid = false;
  }

  if (!msgVal || msgVal.length < 20) {
    setError('err-message', 'Please write at least 20 characters about yourself.');
    valid = false;
  } else if (msgVal.length > charLimit) {
    setError('err-message', `Message too long — maximum is ${charLimit} characters.`);
    valid = false;
  }

  return {
    valid,
    data: {
      name: nameVal,
      email: emailVal,
      age: ageVal,
      message: msgVal,
      skills: [...skills]
    }
  };
}

// handle form submit
form.addEventListener('submit', (e) => {
  e.preventDefault(); // prevent default navigation/submission
  const validation = validateForm();
  if (!validation.valid) {
    formResult.textContent = 'Please fix the errors above.';
    formResult.style.color = 'crimson';
    return;
  }

  // Simulate successful submission
  formResult.textContent = 'Form successfully submitted. Thank you!';
  formResult.style.color = 'green';
  console.log('Submitted data:', validation.data);

  // Also update the preview one last time
  previewName.textContent = validation.data.name;
  previewEmail.textContent = validation.data.email;
  updatePreviewSkills();
});

/* ========================
   Part E: Reset behavior
   - Clear form, preview, and skills
   ======================== */
resetBtn.addEventListener('click', () => {
  form.reset();
  skills = [];
  renderSkills();
  updatePreviewSkills();
  previewName.textContent = 'Your name here';
  previewEmail.textContent = 'your.email@example.com';
  charCount.textContent = '0';
  setError('err-name', '');
  setError('err-email', '');
  setError('err-age', '');
  setError('err-message', '');
  formResult.textContent = '';
});

/* ========================
   Part F: Download modified "file" demonstration
   - Demonstrates file creation and download from browser
   ======================== */
downloadBtn.addEventListener('click', () => {
  const text = [
    `Name: ${nameInput.value || '(empty)'}`,
    `Email: ${emailInput.value || '(empty)'}`,
    `Age: ${ageInput.value || '(empty)'}`,
    `Skills: ${skills.join(', ') || '(none)'}`,
    '',
    '--- Bio ---',
    msgInput.value || '(empty)'
  ].join('\n');

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'profile_modified.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

/* ========================
   Part G: Theme toggle (small extra interaction)
   - Demonstrates toggling a class on body (affects CSS variables)
   ======================== */
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

/* ========================
   Initial render
   ======================== */
renderSkills();
updatePreviewSkills();
// End of scripts.js

