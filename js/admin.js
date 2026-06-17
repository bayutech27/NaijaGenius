// ==================================================================
// admin.js — NaijaGenius Admin Panel (Modular Firebase v12.14.0)
// ==================================================================

// ---------- Imports from firebase.config.js ----------
import { auth, db } from '/js/firebase.config.js';

// ---------- Direct CDN imports (v12.14.0) ----------
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
    // Optionally check admin role (isAdmin) – we rely on Firestore rules for admin access
    initApp();
});

// ==================================================================
// TAB SWITCHING
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
            // Refresh data when switching to tournament or withdrawals tab
            if (target === 'tournaments') loadTournaments();
            if (target === 'withdrawals') loadWithdrawals();
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                window.location.href = '/login.html';
            })
            .catch(() => {});
    });

    // Init uploader
    initUploader();

    // Load tournaments and withdrawals initially
    loadTournaments();
    loadWithdrawals();
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

    // Click to browse
    dropZone.addEventListener('click', () => fileInput.click());

    // Drag events
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
        const expected = ['question', 'optiona', 'optionb', 'optionc', 'optiond', 'correctanswer', 'category'];
        const valid = expected.every((h) => headers.includes(h));
        if (!valid) {
            showSummary(
                'Invalid CSV format. Headers must be: question, optionA, optionB, optionC, optionD, correctAnswer, category',
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
            return;
        }

        let msg = `✅ ${cleanCount} questions ready to upload.`;
        if (errors.length > 0) {
            msg += ` ⚠️ ${errors.length} rows have issues (rows: ${errors.join(', ')})`;
        }
        showSummary(msg, false);
        uploadBtn.disabled = false;
        uploadBtn.dataset.valid = 'true';
    }

    function showSummary(msg, isError) {
        summaryDiv.style.display = 'block';
        summaryDiv.textContent = msg;
        summaryDiv.className = 'upload-summary' + (isError ? ' error' : '');
    }

    // Sample CSV download
    sampleBtn.addEventListener('click', () => {
        const headers = ['question', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'category'];
        const rows = [
            [
                'Who was the first president of Nigeria?',
                'Nnamdi Azikiwe',
                'Abubakar Tafawa Balewa',
                'Yakubu Gowon',
                'Olusegun Obasanjo',
                'Nnamdi Azikiwe',
                'History',
            ],
            [
                'What is the capital of Lagos State?',
                'Ikeja',
                'Lagos Island',
                'Victoria Island',
                'Lekki',
                'Ikeja',
                'Geography',
            ],
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
                        uploadedAt: serverTimestamp(),
                    });
                });
                await batch.commit();
                uploaded += chunk.length;
                progressDiv.textContent = `Uploading… ${uploaded} of ${cleanRows.length}`;
            }
            progressDiv.textContent = `✅ Upload complete — ${cleanRows.length} questions added.`;
            uploadBtn.disabled = false;
        } catch (err) {
            progressDiv.textContent = `❌ Upload failed: ${err.message}`;
            uploadBtn.disabled = false;
        }
    });
}

// ==================================================================
// 2. TOURNAMENT LEADERBOARD
// ==================================================================
let tournamentType = 'Naija Pikin';
let currentGameNumber = null;

function loadTournaments() {
    const typeSelect = document.getElementById('tournamentType');
    const gameSelect = document.getElementById('gameNumber');

    typeSelect.addEventListener('change', () => {
        tournamentType = typeSelect.value;
        populateGameNumbers(tournamentType);
    });

    gameSelect.addEventListener('change', () => {
        currentGameNumber = parseInt(gameSelect.value);
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

    // Find tournament doc by type + gameNumber
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
            // Now get leaderboard subcollection
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
// 3. WITHDRAWALS (real‑time listener)
// ==================================================================
function loadWithdrawals() {
    const tbody = document.getElementById('withdrawalsTbody');
    const table = document.getElementById('withdrawalsTable');
    const spinner = document.getElementById('withdrawalsSpinner');
    const empty = document.getElementById('withdrawalsEmpty');

    table.style.display = 'none';
    empty.style.display = 'none';
    spinner.style.display = 'block';
    tbody.innerHTML = '';

    // Real‑time listener
    const q = query(collection(db, 'withdrawals'), orderBy('date', 'desc'));

    onSnapshot(
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

            // Attach change events to status selects
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