// ==================================================================
// admin.js — NaijaGenius Admin Panel (Modular Firebase v12.14.0)
// ==================================================================

// ---------- Imports ----------
import { auth, db } from '/js/firebase.config.js';

import {
    collection,
    doc,
    getDocs,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp,
    getDoc,
    writeBatch,
    documentId
} from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js';
import {
    onAuthStateChanged,
    signOut
} from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js';

// ==================================================================
// AUTH GUARD
// ==================================================================
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = '/login.html';
        return;
    }
    initApp();
});

// ==================================================================
// TAB SWITCHING (lazy‑load data only when tab is clicked)
// ==================================================================
function initApp() {
    const tabs = document.querySelectorAll('.tab-btn');
    const panels = {
        questions: document.getElementById('tab-questions'),
        tournaments: document.getElementById('tab-tournaments'),
        withdrawals: document.getElementById('tab-withdrawals')
    };

    tabs.forEach((btn) => {
        btn.addEventListener('click', () => {
            tabs.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            const target = btn.dataset.tab;
            Object.keys(panels).forEach((key) => {
                panels[key].classList.toggle('active', key === target);
            });
            // Load data only when the tab is first activated
            if (target === 'tournaments') loadTournaments();
            if (target === 'withdrawals') loadWithdrawals();
        });
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                window.location.href = '/login.html';
            })
            .catch(() => {});
    });

    // Initialise uploader (always available)
    initUploader();

    // Do NOT auto‑load tournaments or withdrawals – they load when tab is clicked.
}

// ==================================================================
// TOAST HELPER
// ==================================================================
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 9999;
            display: flex; flex-direction: column; gap: 10px;
        `;
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.style.cssText = `
        background: #1C2A45; color: #fff; padding: 12px 20px;
        border-radius: 8px; border-left: 4px solid ${type === 'success' ? '#00C853' : '#F5C518'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ==================================================================
// 1. QUESTIONS UPLOADER
// ==================================================================
function initUploader() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const sampleBtn = document.getElementById('sampleBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const summaryDiv = document.getElementById('uploadSummary');
    const progressDiv = document.getElementById('uploadProgress');
    const typeSelect = document.getElementById('questionType');

    let parsedData = null; // { headers: [], rows: [], errors: [] }

    // Create preview container if not exists
    let previewContainer = document.getElementById('previewContainer');
    if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.id = 'previewContainer';
        previewContainer.style.cssText = `
            margin-top: 1rem;
            max-height: 300px;
            overflow-y: auto;
            background: #0B1120;
            border-radius: 8px;
            padding: 1rem;
            display: none;
        `;
        dropZone.parentNode.insertBefore(previewContainer, dropZone.nextSibling);
    }

    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFile(fileInput.files[0]);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleFile(fileInput.files[0]);
        }
    });

    function handleFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            parseCSV(text);
        };
        reader.readAsText(file);
    }

    function parseCSV(text) {
        const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');
        if (lines.length === 0) {
            showSummary('CSV file is empty.', true);
            return;
        }

        const headerLine = lines[0];
        const headers = headerLine.split(',').map((h) => h.trim().toLowerCase());
        const expected = ['question', 'optiona', 'optionb', 'optionc', 'optiond', 'correctanswer', 'category', 'difficulty'];
        const valid = expected.every((h) => headers.includes(h));
        if (!valid) {
            showSummary(
                'Invalid CSV format. Headers must be: question, optionA, optionB, optionC, optionD, correctAnswer, category, difficulty',
                true
            );
            return;
        }

        const rows = [];
        const errors = [];
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map((c) => c.trim());
            const row = {};
            headers.forEach((h, idx) => {
                row[h] = cols[idx] || '';
            });
            const missing = expected.some((f) => row[f] === '');
            if (missing) {
                errors.push(i + 1);
            }
            rows.push(row);
        }

        parsedData = { headers, rows, errors };
        const cleanCount = rows.length - errors.length;
        if (cleanCount === 0) {
            showSummary(`⚠️ No valid rows. All ${rows.length} rows have missing fields.`, true);
            uploadBtn.disabled = true;
            previewContainer.style.display = 'none';
            return;
        }

        let msg = `✅ ${cleanCount} questions ready to upload.`;
        if (errors.length > 0) {
            msg += ` ⚠️ ${errors.length} rows have issues (rows: ${errors.join(', ')})`;
        }
        showSummary(msg, false);
        uploadBtn.disabled = false;
        uploadBtn.dataset.valid = 'true';

        // Show preview (first 10 rows)
        showPreview(rows, errors);
    }

    function showSummary(msg, isError) {
        summaryDiv.style.display = 'block';
        summaryDiv.textContent = msg;
        summaryDiv.className = 'upload-summary' + (isError ? ' error' : '');
    }

    function showPreview(rows, errors) {
        const preview = document.getElementById('previewContainer');
        if (!preview) return;
        preview.style.display = 'block';
        let html = `<p><strong>Total questions:</strong> ${rows.length}</p>`;
        html += `<table style="width:100%; border-collapse: collapse; font-size: 0.8rem; margin-top: 0.5rem;">
            <thead><tr>`;
        const displayHeaders = ['question', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'category', 'difficulty'];
        displayHeaders.forEach(h => {
            html += `<th style="text-align:left; padding:0.3rem; border-bottom:1px solid #2a3a5a; color:#F5C518;">${h}</th>`;
        });
        html += `</tr></thead><tbody>`;
        const showRows = rows.slice(0, 10);
        showRows.forEach((row, idx) => {
            const isError = errors.includes(idx + 2);
            html += `<tr style="${isError ? 'background: #b4530920;' : ''}">`;
            displayHeaders.forEach(h => {
                const val = row[h] || '';
                html += `<td style="padding:0.3rem; border-bottom:1px solid #1C2A45;">${val.substring(0, 30)}${val.length > 30 ? '…' : ''}</td>`;
            });
            html += `</tr>`;
        });
        if (rows.length > 10) {
            html += `<tr><td colspan="8" style="padding:0.5rem; text-align:center; color:#CBD5E1;">... and ${rows.length - 10} more rows</td></tr>`;
        }
        html += `</tbody></table>`;
        preview.innerHTML = html;
    }

    // Sample CSV download
    sampleBtn.addEventListener('click', () => {
        const headers = ['question', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'category', 'difficulty'];
        const rows = [
            [
                'Who was the first president of Nigeria?',
                'Nnamdi Azikiwe',
                'Abubakar Tafawa Balewa',
                'Yakubu Gowon',
                'Olusegun Obasanjo',
                'Nnamdi Azikiwe',
                'History',
                'medium'
            ],
            [
                'What is the capital of Lagos State?',
                'Ikeja',
                'Lagos Island',
                'Victoria Island',
                'Lekki',
                'Ikeja',
                'Geography',
                'easy'
            ]
        ];
        let csv = headers.join(',') + '\n';
        rows.forEach((r) => (csv += r.join(',') + '\n'));
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'naijagenius_questions_sample.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Upload to Firestore
    uploadBtn.addEventListener('click', async () => {
        if (uploadBtn.disabled) return;
        const collectionName = typeSelect.value === 'regular' ? 'questions_regular' : 'questions_tournament';
        const cleanRows = parsedData.rows.filter((row, idx) => {
            return !parsedData.errors.includes(idx + 2);
        });

        if (cleanRows.length === 0) {
            showSummary('No valid rows to upload.', true);
            return;
        }

        uploadBtn.disabled = true;
        progressDiv.style.display = 'block';
        progressDiv.textContent = `Uploading… 0 of ${cleanRows.length}`;

        const batchSize = 500;
        let uploaded = 0;
        try {
            for (let i = 0; i < cleanRows.length; i += batchSize) {
                const batch = writeBatch(db);
                const chunk = cleanRows.slice(i, i + batchSize);
                chunk.forEach((row) => {
                    const docRef = doc(collection(db, collectionName));
                    batch.set(docRef, {
                        question: row.question,
                        optionA: row.optiona,
                        optionB: row.optionb,
                        optionC: row.optionc,
                        optionD: row.optiond,
                        correctAnswer: row.correctanswer,
                        category: row.category,
                        difficulty: row.difficulty || 'medium',
                        uploadedAt: serverTimestamp(),
                    });
                });
                await batch.commit();
                uploaded += chunk.length;
                progressDiv.textContent = `Uploading… ${uploaded} of ${cleanRows.length}`;
            }
            progressDiv.textContent = `✅ Upload complete — ${cleanRows.length} questions added.`;
            uploadBtn.disabled = false;
            showToast(`✅ ${cleanRows.length} questions uploaded to ${collectionName} successfully!`, 'success');
            // Clear preview and form
            const preview = document.getElementById('previewContainer');
            if (preview) preview.style.display = 'none';
            fileInput.value = '';
            parsedData = null;
            summaryDiv.style.display = 'none';

            // Optional: verify by reading a few documents
            try {
                const q = query(collection(db, collectionName), limit(3));
                const snap = await getDocs(q);
                console.log(`Verification: ${snap.size} documents found in ${collectionName}`);
            } catch (err) {
                console.warn('Could not verify upload:', err);
            }
        } catch (err) {
            progressDiv.textContent = `❌ Upload failed: ${err.message}`;
            uploadBtn.disabled = false;
            showToast(`❌ Upload failed: ${err.message}`, 'error');
        }
    });
}

// ==================================================================
// 2. TOURNAMENT LEADERBOARD (lazy‑loaded)
// ==================================================================
let tournamentType = 'Naija Pikin';
let currentGameNumber = null;

function loadTournaments() {
    // Only set up once
    const typeSelect = document.getElementById('tournamentType');
    const gameSelect = document.getElementById('gameNumber');

    // Remove previous listeners to avoid duplicates
    typeSelect.replaceWith(typeSelect.cloneNode(true));
    gameSelect.replaceWith(gameSelect.cloneNode(true));

    const newTypeSelect = document.getElementById('tournamentType');
    const newGameSelect = document.getElementById('gameNumber');

    newTypeSelect.addEventListener('change', () => {
        tournamentType = newTypeSelect.value;
        populateGameNumbers(tournamentType);
    });

    newGameSelect.addEventListener('change', () => {
        currentGameNumber = parseInt(newGameSelect.value);
        if (!isNaN(currentGameNumber)) {
            loadLeaderboard(tournamentType, currentGameNumber);
        }
    });

    populateGameNumbers(tournamentType);
}

async function populateGameNumbers(type) {
    const gameSelect = document.getElementById('gameNumber');
    const spinner = document.getElementById('tournamentSpinner');
    const table = document.getElementById('tournamentTable');
    const empty = document.getElementById('tournamentEmpty');

    gameSelect.innerHTML = '<option value="">Loading games...</option>';
    table.style.display = 'none';
    empty.style.display = 'none';
    spinner.style.display = 'block';

    try {
        // This query requires a composite index on `tournaments`:
        // Fields: type (ascending), gameNumber (descending)
        const q = query(
            collection(db, 'tournaments'),
            where('type', '==', type),
            orderBy('gameNumber', 'desc')
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            gameSelect.innerHTML = '<option value="">No games found</option>';
            spinner.style.display = 'none';
            return;
        }

        let html = '';
        let firstGame = null;
        snapshot.forEach((doc) => {
            const data = doc.data();
            const num = data.gameNumber;
            if (firstGame === null) firstGame = num;
            html += `<option value="${num}">Game ${num}</option>`;
        });
        gameSelect.innerHTML = html;
        if (firstGame !== null) {
            gameSelect.value = firstGame;
            currentGameNumber = firstGame;
            loadLeaderboard(type, firstGame);
        }
        spinner.style.display = 'none';
    } catch (err) {
        console.error(err);
        gameSelect.innerHTML = '<option value="">Error loading games</option>';
        spinner.style.display = 'none';
    }
}

function loadLeaderboard(type, gameNumber) {
    const tbody = document.getElementById('tournamentTbody');
    const table = document.getElementById('tournamentTable');
    const spinner = document.getElementById('tournamentSpinner');
    const empty = document.getElementById('tournamentEmpty');

    table.style.display = 'none';
    empty.style.display = 'none';
    spinner.style.display = 'block';
    tbody.innerHTML = '';

    const q = query(
        collection(db, 'tournaments'),
        where('type', '==', type),
        where('gameNumber', '==', gameNumber),
        limit(1)
    );
    getDocs(q)
        .then((snapshot) => {
            if (snapshot.empty) {
                spinner.style.display = 'none';
                empty.style.display = 'block';
                return;
            }
            const docId = snapshot.docs[0].id;
            return getDocs(
                query(collection(db, 'tournaments', docId, 'leaderboard'), orderBy('position', 'asc'))
            );
        })
        .then((snapshot) => {
            spinner.style.display = 'none';
            if (!snapshot || snapshot.empty) {
                empty.style.display = 'block';
                return;
            }
            table.style.display = 'table';
            let html = '';
            let rank = 1;
            snapshot.forEach((doc) => {
                const data = doc.data();
                html += `<tr>
                    <td>${rank++}</td>
                    <td>${data.username || '-'}</td>
                    <td>${data.points || 0}</td>
                    <td>${data.position || '-'}</td>
                </tr>`;
            });
            tbody.innerHTML = html;
        })
        .catch((err) => {
            console.error(err);
            spinner.style.display = 'none';
            empty.style.display = 'block';
            empty.textContent = 'Error loading leaderboard.';
        });
}

// ==================================================================
// 3. WITHDRAWALS (lazy‑loaded, real‑time)
// ==================================================================
let withdrawalsUnsubscribe = null;

function loadWithdrawals() {
    // If already listening, detach to avoid duplicates
    if (withdrawalsUnsubscribe) {
        withdrawalsUnsubscribe();
        withdrawalsUnsubscribe = null;
    }

    const tbody = document.getElementById('withdrawalsTbody');
    const table = document.getElementById('withdrawalsTable');
    const spinner = document.getElementById('withdrawalsSpinner');
    const empty = document.getElementById('withdrawalsEmpty');

    table.style.display = 'none';
    empty.style.display = 'none';
    spinner.style.display = 'block';
    tbody.innerHTML = '';

    const q = query(collection(db, 'withdrawals'), orderBy('date', 'desc'));

    withdrawalsUnsubscribe = onSnapshot(
        q,
        (snapshot) => {
            spinner.style.display = 'none';
            if (snapshot.empty) {
                empty.style.display = 'block';
                table.style.display = 'none';
                return;
            }
            table.style.display = 'table';
            let html = '';
            let index = 1;
            snapshot.forEach((doc) => {
                const data = doc.data();
                const id = doc.id;
                const status = data.status || 'Pending';
                let dateStr = '-';
                if (data.date) {
                    const d = data.date.toDate ? data.date.toDate() : new Date(data.date);
                    dateStr = d.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    });
                }
                html += `<tr>
                    <td>${index++}</td>
                    <td>${data.username || '-'}</td>
                    <td>${data.fullName || '-'}</td>
                    <td>${data.tournament || '-'}</td>
                    <td>${dateStr}</td>
                    <td>${data.winningPoints || 0}</td>
                    <td>${data.position || '-'}</td>
                    <td>${data.amount || '₦0'}</td>
                    <td title="${data.bankDetails || ''}">${data.bankDetails ? data.bankDetails.slice(0, 20) + (data.bankDetails.length > 20 ? '…' : '') : '-'}</td>
                    <td>
                        <select class="status-select ${status}" data-docid="${id}">
                            <option value="Pending" ${status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Paid" ${status === 'Paid' ? 'selected' : ''}>Paid</option>
                            <option value="Cancelled" ${status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </td>
                </tr>`;
            });
            tbody.innerHTML = html;

            document.querySelectorAll('.status-select').forEach((sel) => {
                sel.addEventListener('change', function () {
                    const docId = this.dataset.docid;
                    const newStatus = this.value;
                    updateDoc(doc(db, 'withdrawals', docId), {
                        status: newStatus,
                    }).catch((err) => {
                        console.error('Error updating status:', err);
                        alert('Failed to update status. Please try again.');
                    });
                });
            });
        },
        (err) => {
            console.error('Withdrawals listener error:', err);
            spinner.style.display = 'none';
            empty.style.display = 'block';
            empty.textContent = 'Error loading withdrawals.';
        }
    );
}