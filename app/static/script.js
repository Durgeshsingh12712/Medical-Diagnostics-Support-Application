const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');
        const fileList = document.getElementById('file-list');
        const uploadBtn = document.getElementById('upload-btn');
        const uploadMessage = document.getElementById('upload-message');
        const questionInput = document.getElementById('question-input');
        const charCount = document.getElementById('char-count');
        const submitBtn = document.getElementById('submit-question');
        const responseContent = document.getElementById('response-content');

        let selectedFiles = [];

        // Upload area interactions
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });

        // Character counter
        questionInput.addEventListener('input', () => {
            const length = questionInput.value.length;
            charCount.textContent = `${length} / 2000`;
            charCount.style.color = length > 1800 ? '#e74c3c' : '#7f8c8d';
        });

        function handleFiles(files) {
            selectedFiles = Array.from(files);
            displayFileList();
            uploadBtn.disabled = selectedFiles.length === 0;
        }

        function displayFileList() {
            if (selectedFiles.length === 0) {
                fileList.style.display = 'none';
                return;
            }

            fileList.style.display = 'block';
            fileList.innerHTML = selectedFiles.map((file, index) => `
                <div class="file-item">
                    <div class="file-name">
                        <span>📄</span>
                        ${file.name}
                    </div>
                    <div class="file-size">
                        ${formatFileSize(file.size)}
                    </div>
                </div>
            `).join('');
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        function showMessage(message, type = 'success') {
            uploadMessage.innerHTML = `
                <div class="${type}-message">
                    ${message}
                </div>
            `;
            setTimeout(() => {
                uploadMessage.innerHTML = '';
            }, 5000);
        }

        function setLoading(element, isLoading, originalText) {
            if (isLoading) {
                element.innerHTML = `
                    <span class="loading">
                        <span class="spinner"></span>
                        Processing...
                    </span>
                `;
                element.disabled = true;
            } else {
                element.textContent = originalText;
                element.disabled = false;
            }
        }

        // Upload form handler
        uploadBtn.addEventListener('click', async () => {
            if (selectedFiles.length === 0) return;

            const formData = new FormData();
            selectedFiles.forEach(file => formData.append('file', file));

            setLoading(uploadBtn, true, 'Upload Documents');

            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                
                if (response.ok) {
                    showMessage(result.message || 'Files uploaded successfully!', 'success');
                    selectedFiles = [];
                    fileInput.value = '';
                    displayFileList();
                    uploadBtn.disabled = true;
                } else {
                    showMessage(result.error || 'Upload failed', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('Error uploading files. Please try again.', 'error');
            } finally {
                setLoading(uploadBtn, false, 'Upload Documents');
            }
        });

        // Question submission handler
        submitBtn.addEventListener('click', async () => {
            const question = questionInput.value.trim();
            
            if (!question) {
                questionInput.focus();
                return;
            }

            setLoading(submitBtn, true, 'Ask Question');
            responseContent.innerHTML = '<span class="loading"><span class="spinner"></span>Analyzing your question...</span>';

            try {
                const response = await fetch('/query', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ question })
                });
                const result = await response.json();
                
                if (response.ok) {
                    responseContent.textContent = result.response || 'No response received.';
                } else {
                    responseContent.innerHTML = `<div class="error-message">${result.error || 'Error processing question'}</div>`;
                }
            } catch (error) {
                console.error('Error:', error);
                responseContent.innerHTML = '<div class="error-message">Error getting response. Please try again.</div>';
            } finally {
                setLoading(submitBtn, false, 'Ask Question');
            }
        });

        // Enter key handler for question input
        questionInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                submitBtn.click();
            }
        });