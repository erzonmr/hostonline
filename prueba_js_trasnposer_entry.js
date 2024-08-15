// Definición de notas y sus equivalentes para transposición
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const flats = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

function transposeNote(note, semitones) {
    let index = notes.indexOf(note);
    if (index === -1) index = flats.indexOf(note);
    if (index === -1) return note;

    // Calcular la nueva nota
    index = (index + semitones + 12) % 12;
    let newNote = notes[index];

    // Mantener la misma notación (# o b) que la nota original
    if (note.includes('b')) {
        newNote = flats[index];
    }

    return newNote;
}

function transposeChord(chord, semitones) {
    // Manejar acordes con slash
    const [upperChord, bassNote] = chord.split('/');
    
    // Transponer la parte principal del acorde
    const match = upperChord.match(/^([A-G][#b]?)(.*)$/);
    if (!match) return chord;

    let [, note, modifier] = match;
    let transposedNote = transposeNote(note, semitones);
    let transposedUpperChord = transposedNote + modifier;

    // Transponer la nota del bajo si existe
    if (bassNote) {
        const transposedBassNote = transposeNote(bassNote, semitones);
        return `${transposedUpperChord}/${transposedBassNote}`;
    }

    return transposedUpperChord;
}

function transposeChords(semitones) {
    document.querySelectorAll('.chordpro-chord').forEach(chordSpan => {
        const originalChord = chordSpan.getAttribute('data-chord');
        const transposedChord = transposeChord(originalChord, semitones);
        chordSpan.setAttribute('data-chord', transposedChord);
        chordSpan.textContent = transposedChord;
    });

    // Actualizar el tono en el metadata
    const keySpan = document.querySelector('.chordpro-metadata-value');
    if (keySpan) {
        const currentKey = keySpan.textContent;
        const newKey = transposeNote(currentKey, semitones);
        keySpan.textContent = newKey;
    }
}

function addTranspositionControls() {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'transposition-controls';
    controlsDiv.innerHTML = `
        <button onclick="transposeChords(-1)">♭ Bajar medio tono</button>
        <button onclick="transposeChords(1)">♯ Subir medio tono</button>
    `;
    document.querySelector('.song-header').after(controlsDiv);
}

// Inicializar controles de transposición cuando el documento esté listo
document.addEventListener('DOMContentLoaded', addTranspositionControls);
