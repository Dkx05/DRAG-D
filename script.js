// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Form sections
    const sections = [
        'personal-section',
        'experience-section',
        'education-section',
        'skills-section',
        'achievements-section',
        'preview-section'
    ];
    let currentSection = 0;

    // Show first section initially
    showSection(currentSection);

    // Next button functionality
    document.getElementById('personal-next').addEventListener('click', () => validateAndProceed('personal-form', 1));
    document.getElementById('experience-next').addEventListener('click', () => validateAndProceed('experience-entries .experience-form', 2));
    document.getElementById('education-next').addEventListener('click', () => validateAndProceed('education-entries .education-form', 3));
    document.getElementById('skills-next').addEventListener('click', () => validateAndProceed('achievements-entries .achievement-form', 4));
    document.getElementById('achievements-next').addEventListener('click', () => {
        generateResumePreview();
        showSection(5);
    });

    // Previous button functionality
    document.getElementById('experience-prev').addEventListener('click', () => showSection(0));
    document.getElementById('education-prev').addEventListener('click', () => showSection(1));
    document.getElementById('skills-prev').addEventListener('click', () => showSection(2));
    document.getElementById('achievements-prev').addEventListener('click', () => showSection(3));
    document.getElementById('preview-prev').addEventListener('click', () => showSection(4));

    function showSection(index) {
        // Hide all sections
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show current section
        document.getElementById(sections[index]).classList.add('active');
        currentSection = index;
    }

    function validateAndProceed(formSelector, nextSectionIndex) {
        const forms = document.querySelectorAll(formSelector);
        let isValid = true;

        forms.forEach(form => {
            const inputs = form.querySelectorAll('[required]');
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = 'red';
                    isValid = false;
                    
                    // Add error message if not exists
                    if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'This field is required';
                        errorMsg.style.color = 'red';
                        errorMsg.style.fontSize = '0.8rem';
                        errorMsg.style.marginTop = '0.25rem';
                        input.insertAdjacentElement('afterend', errorMsg);
                    }
                } else {
                    input.style.borderColor = '';
                    const errorMsg = input.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.remove();
                    }
                }
            });
        });

        if (isValid) {
            showSection(nextSectionIndex);
        } else {
            alert('Please fill all required fields before proceeding.');
        }
    }

    // Photo Upload Preview
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photo-preview');
    
    photoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.addEventListener('load', function() {
                photoPreview.innerHTML = `<img src="${this.result}" alt="Profile Photo">`;
            });
            
            reader.readAsDataURL(file);
        }
    });
    
    // Add Experience
    const addExperienceBtn = document.getElementById('add-experience');
    const experienceEntries = document.getElementById('experience-entries');
    
    addExperienceBtn.addEventListener('click', () => {
        const newEntry = document.createElement('div');
        newEntry.className = 'experience-entry';
        newEntry.innerHTML = `
            <form class="experience-form">
                <div class="form-group">
                    <label>Job Title*</label>
                    <input type="text" class="job-title" required>
                </div>
                <div class="form-group">
                    <label>Company*</label>
                    <input type="text" class="company" required>
                </div>
                <div class="form-group">
                    <label>Duration*</label>
                    <input type="text" class="duration" required>
                </div>
                <div class="form-group">
                    <label>Description*</label>
                    <textarea class="description" rows="4" required></textarea>
                </div>
                <button type="button" class="remove-btn">Remove</button>
            </form>
        `;
        experienceEntries.appendChild(newEntry);
        
        newEntry.querySelector('.remove-btn').addEventListener('click', () => {
            experienceEntries.removeChild(newEntry);
        });
    });
    
    // Add Education
    const addEducationBtn = document.getElementById('add-education');
    const educationEntries = document.getElementById('education-entries');
    
    addEducationBtn.addEventListener('click', () => {
        const newEntry = document.createElement('div');
        newEntry.className = 'education-entry';
        newEntry.innerHTML = `
            <form class="education-form">
                <div class="form-group">
                    <label>Degree*</label>
                    <input type="text" class="degree" required>
                </div>
                <div class="form-group">
                    <label>Institution*</label>
                    <input type="text" class="institution" required>
                </div>
                <div class="form-group">
                    <label>Year*</label>
                    <input type="text" class="year" required>
                </div>
                <div class="form-group">
                    <label>GPA/Score (optional)</label>
                    <input type="text" class="gpa">
                </div>
                <button type="button" class="remove-btn">Remove</button>
            </form>
        `;
        educationEntries.appendChild(newEntry);
        
        newEntry.querySelector('.remove-btn').addEventListener('click', () => {
            educationEntries.removeChild(newEntry);
        });
    });
    
    // Skills Management
    const skillsInput = document.getElementById('skills-input');
    const addSkillsBtn = document.getElementById('add-skills');
    const skillsList = document.getElementById('skills-list');

    skillsList.innerHTML = '';

    addSkillsBtn.addEventListener('click', addSkillsFromInput);

    skillsInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkillsFromInput();
        }
    });

    function addSkillsFromInput() {
        const skillsText = skillsInput.value.trim();
        if (skillsText) {
            const skillsArray = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill);
            
            skillsArray.forEach(skill => {
                if (!skillExists(skill)) {
                    addSkillTag(skill);
                }
            });
            
            skillsInput.value = '';
        }
    }

    function skillExists(skill) {
        const skills = Array.from(skillsList.querySelectorAll('.skill-tag span'));
        return skills.some(existingSkill => 
            existingSkill.textContent.toLowerCase() === skill.toLowerCase()
        );
    }

    function addSkillTag(skill) {
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            <span>${skill}</span>
            <button class="remove-skill">&times;</button>
        `;
        skillsList.appendChild(skillTag);
        
        skillTag.querySelector('.remove-skill').addEventListener('click', function() {
            skillsList.removeChild(skillTag);
        });
    }

    // Add Achievements
    const addAchievementBtn = document.getElementById('add-achievement');
    const achievementsEntries = document.getElementById('achievements-entries');

    addAchievementBtn.addEventListener('click', () => {
        const newEntry = document.createElement('div');
        newEntry.className = 'achievement-entry';
        newEntry.innerHTML = `
            <form class="achievement-form">
                <div class="form-group">
                    <label>Achievement Title*</label>
                    <input type="text" class="achievement-title" required>
                </div>
                <div class="form-group">
                    <label>Description*</label>
                    <textarea class="achievement-description" rows="3" required></textarea>
                </div>
                <button type="button" class="remove-btn">Remove</button>
            </form>
        `;
        achievementsEntries.appendChild(newEntry);
        
        newEntry.querySelector('.remove-btn').addEventListener('click', () => {
            achievementsEntries.removeChild(newEntry);
        });
    });

    // Generate Resume Preview
    function generateResumePreview() {
        const resumePreview = document.getElementById('resume-preview');
        resumePreview.className = 'professional-resume';
        
        // Get personal information
        const fullName = document.getElementById('full-name').value || 'Cookie';
        const profession = document.getElementById('profession').value || 'Front-End Developer';
        const email = document.getElementById('email').value || 'cookie@example.com';
        const phone = document.getElementById('phone').value || '+91 1234567890';
        const address = document.getElementById('address').value || 'Cookie Land';
        const summary = document.getElementById('summary').value || 'I am passionate about creating delicious web experiences. Combining technical skills with creative frosting to build amazing user interfaces.';
        const photoInput = document.getElementById('photo');
        
        // Get photo if uploaded
        let photoHtml = '';
        if (photoInput.files && photoInput.files[0]) {
            photoHtml = `<img src="${URL.createObjectURL(photoInput.files[0])}" alt="Profile Photo" class="resume-photo">`;
        }
        
        // Get experiences
        const experienceEntries = document.querySelectorAll('.experience-entry');
        let experiencesHTML = '';
        experienceEntries.forEach(entry => {
            const jobTitle = entry.querySelector('.job-title').value || 'Job Title';
            const company = entry.querySelector('.company').value || 'Company Name';
            const duration = entry.querySelector('.duration').value || 'Duration';
            const description = entry.querySelector('.description').value || 'Job description and responsibilities.';
            
            experiencesHTML += `
                <div class="experience-item">
                    <h3 class="job-title">${jobTitle}</h3>
                    <div class="company">${company}</div>
                    <div class="duration">${duration}</div>
                    <p class="job-description">${description.replace(/\n/g, '<br>')}</p>
                </div>
            `;
        });
        
        // Get education
        const educationEntries = document.querySelectorAll('.education-entry');
        let educationHTML = '';
        educationEntries.forEach(entry => {
            const degree = entry.querySelector('.degree').value || 'Degree';
            const institution = entry.querySelector('.institution').value || 'Institution';
            const year = entry.querySelector('.year').value || 'Year';
            const gpa = entry.querySelector('.gpa').value;
            
            educationHTML += `
                <div class="education-item">
                    <h3 class="degree">${degree}</h3>
                    <div class="institution">${institution}</div>
                    <div class="year">${year}</div>
                    ${gpa ? `<div class="gpa">GPA: ${gpa}</div>` : ''}
                </div>
            `;
        });
        
        // Get skills
        const skillTags = document.querySelectorAll('.skill-tag span');
        let skillsHTML = '';
        skillTags.forEach(tag => {
            skillsHTML += `<div class="skill-pill">${tag.textContent}</div>`;
        });
        
        // Get achievements
        let achievementsHTML = '';
        document.querySelectorAll('.achievement-entry').forEach(entry => {
            const title = entry.querySelector('.achievement-title').value || 'Achievement';
            const description = entry.querySelector('.achievement-description').value || 'Description';
            
            achievementsHTML += `
                <div class="achievement-item">
                    <h3>${title}</h3>
                    <p>${description.replace(/\n/g, '<br>')}</p>
                </div>
            `;
        });

        // Generate the resume HTML
        resumePreview.innerHTML = `
            ${photoHtml}
            <div class="resume-header">
                <h1>${fullName.toUpperCase()}</h1>
                <h2>${profession}</h2>
            </div>
            
            <div class="contact-info">
                ${phone ? `<div class="contact-item"><i class="fas fa-phone"></i> ${phone}</div>` : ''}
                ${email ? `<div class="contact-item"><i class="fas fa-envelope"></i> ${email}</div>` : ''}
                ${address ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${address}</div>` : ''}
            </div>
            
            <hr class="section-divider">
            
            <div class="resume-section">
                <h2 class="section-title">PROFILE</h2>
                <p>${summary.replace(/\n/g, '<br>')}</p>
            </div>
            
            <hr class="section-divider">
            
            ${educationHTML ? `
            <div class="resume-section">
                <h2 class="section-title">EDUCATION</h2>
                ${educationHTML}
            </div>
            <hr class="section-divider">
            ` : ''}
            
            ${experiencesHTML ? `
            <div class="resume-section">
                <h2 class="section-title">EXPERIENCE</h2>
                ${experiencesHTML}
            </div>
            <hr class="section-divider">
            ` : ''}
            
            ${skillsHTML ? `
            <div class="resume-section">
                <h2 class="section-title">SKILLS</h2>
                <div class="skills-container">
                    ${skillsHTML}
                </div>
            </div>
            ` : ''}
            
            ${achievementsHTML ? `
            <hr class="section-divider">
            <div class="resume-section">
                <h2 class="section-title">KEY ACHIEVEMENTS</h2>
                ${achievementsHTML}
            </div>
            ` : ''}
        `;
    }
    
    // Download PDF (placeholder)
    document.getElementById('download-pdf').addEventListener('click', () => {
        alert('PDF download functionality would be implemented with a library like jsPDF or html2pdf.js');
    });
    
    // Print Resume
    document.getElementById('print-resume').addEventListener('click', () => {
        window.print();
    });
});