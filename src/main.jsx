import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownToLine,
  CirclePlus,
  Download,
  FileJson,
  HeartHandshake,
  Link2,
  Map,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  UserRound,
} from 'lucide-react';
import './styles.css';

const STORAGE_KEY = 'love-on-the-world-oikos-map-v1';

const groups = [
  { id: 'family', label: 'Family', color: '#f45d48' },
  { id: 'friends', label: 'Friends', color: '#14b8a6' },
  { id: 'work', label: 'Work', color: '#f59e0b' },
  { id: 'school', label: 'School', color: '#516cf0' },
  { id: 'neighbors', label: 'Neighbors', color: '#8b5cf6' },
];

const stages = [
  { id: 'pray', label: 'Pray' },
  { id: 'care', label: 'Care' },
  { id: 'share', label: 'Share' },
  { id: 'disciple', label: 'Disciple' },
];

const starterPeople = [
  {
    id: crypto.randomUUID(),
    name: 'Aunt Maria',
    group: 'family',
    stage: 'pray',
    notes: 'Pray for peace and an open door.',
    parentId: null,
  },
  {
    id: crypto.randomUUID(),
    name: 'Jordan',
    group: 'friends',
    stage: 'care',
    notes: 'Invite for coffee this week.',
    parentId: null,
  },
  {
    id: crypto.randomUUID(),
    name: 'Sam',
    group: 'work',
    stage: 'share',
    notes: 'Share a short hope story.',
    parentId: null,
  },
  {
    id: crypto.randomUUID(),
    name: 'Leah',
    group: 'neighbors',
    stage: 'pray',
    notes: '',
    parentId: null,
  },
  {
    id: crypto.randomUUID(),
    name: 'Mason',
    group: 'school',
    stage: 'pray',
    notes: '',
    parentId: null,
  },
];

const initialMap = {
  centerName: 'Your Name',
  mapTitle: 'My Oikos Map',
  people: starterPeople,
};

function readStoredMap() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredMap(mapData) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mapData));
    return true;
  } catch {
    return false;
  }
}

function loadSavedMap() {
  try {
    const raw = readStoredMap();
    return raw ? JSON.parse(raw) : initialMap;
  } catch {
    return initialMap;
  }
}

function getGroup(groupId) {
  return groups.find((group) => group.id === groupId) || groups[0];
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || 'oikos-map';
}

function truncateLabel(value, limit = 16) {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit - 1).trim()}...`;
}

function computeLayout(people) {
  const width = 1100;
  const height = 820;
  const center = { x: width / 2, y: height / 2 };
  const roots = people.filter((person) => !person.parentId);
  const childrenByParent = people.reduce((acc, person) => {
    if (person.parentId) {
      acc[person.parentId] = acc[person.parentId] || [];
      acc[person.parentId].push(person);
    }
    return acc;
  }, {});

  const positions = {};
  roots.forEach((person, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / Math.max(roots.length, 1);
    const radius = roots.length > 7 ? 286 : 248;
    const parentPosition = {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
      angle,
    };
    positions[person.id] = parentPosition;

    const children = childrenByParent[person.id] || [];
    children.forEach((child, childIndex) => {
      const spread = Math.min(0.7, 0.22 * Math.max(children.length - 1, 1));
      const childAngle =
        angle - spread / 2 + (children.length === 1 ? 0 : (childIndex * spread) / (children.length - 1));
      positions[child.id] = {
        x: parentPosition.x + Math.cos(childAngle) * 158,
        y: parentPosition.y + Math.sin(childAngle) * 158,
        angle: childAngle,
      };
    });
  });

  return { width, height, center, positions, childrenByParent };
}

function App() {
  const [mapData, setMapData] = useState(loadSavedMap);
  const [selectedId, setSelectedId] = useState(mapData.people[0]?.id ?? null);
  const [saveState, setSaveState] = useState('Saved locally');
  const svgRef = useRef(null);

  const layout = useMemo(() => computeLayout(mapData.people), [mapData.people]);
  const selectedPerson = mapData.people.find((person) => person.id === selectedId) || null;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSaveState(writeStoredMap(mapData) ? 'Saved locally' : 'Download to keep');
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [mapData]);

  function updateMap(partial) {
    setSaveState('Saving...');
    setMapData((current) => ({ ...current, ...partial }));
  }

  function updatePerson(id, updates) {
    setSaveState('Saving...');
    setMapData((current) => ({
      ...current,
      people: current.people.map((person) => (person.id === id ? { ...person, ...updates } : person)),
    }));
  }

  function addPerson(parentId = null) {
    const newPerson = {
      id: crypto.randomUUID(),
      name: parentId ? 'New connection' : 'New person',
      group: selectedPerson?.group || 'friends',
      stage: 'pray',
      notes: '',
      parentId,
    };

    setSaveState('Saving...');
    setMapData((current) => ({ ...current, people: [...current.people, newPerson] }));
    setSelectedId(newPerson.id);
  }

  function deletePerson(id) {
    const descendants = new Set([id]);
    let changed = true;
    while (changed) {
      changed = false;
      mapData.people.forEach((person) => {
        if (person.parentId && descendants.has(person.parentId) && !descendants.has(person.id)) {
          descendants.add(person.id);
          changed = true;
        }
      });
    }

    const remaining = mapData.people.filter((person) => !descendants.has(person.id));
    setMapData((current) => ({ ...current, people: remaining }));
    setSelectedId(remaining[0]?.id ?? null);
    setSaveState('Saved locally');
  }

  function resetMap() {
    const fresh = {
      ...initialMap,
      people: initialMap.people.map((person) => ({ ...person, id: crypto.randomUUID() })),
    };
    setMapData(fresh);
    setSelectedId(fresh.people[0]?.id ?? null);
    setSaveState('Saved locally');
  }

  function saveNow() {
    setSaveState(writeStoredMap(mapData) ? 'Saved locally' : 'Download to keep');
  }

  function downloadJson() {
    downloadBlob(
      new Blob([JSON.stringify(mapData, null, 2)], { type: 'application/json' }),
      `${slugify(mapData.mapTitle)}.json`,
    );
  }

  function getSvgMarkup() {
    const svg = svgRef.current.cloneNode(true);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', layout.width);
    svg.setAttribute('height', layout.height);
    return new XMLSerializer().serializeToString(svg);
  }

  function downloadSvg() {
    downloadBlob(new Blob([getSvgMarkup()], { type: 'image/svg+xml;charset=utf-8' }), `${slugify(mapData.mapTitle)}.svg`);
  }

  function downloadPng() {
    const svgMarkup = getSvgMarkup();
    const image = new Image();
    const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = layout.width * 2;
      canvas.height = layout.height * 2;
      const context = canvas.getContext('2d');
      context.fillStyle = '#fffaf3';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.scale(2, 2);
      context.drawImage(image, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) downloadBlob(blob, `${slugify(mapData.mapTitle)}.png`);
      }, 'image/png');
    };

    image.src = url;
  }

  const rootCount = mapData.people.filter((person) => !person.parentId).length;
  const secondDegreeCount = mapData.people.length - rootCount;

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Oikos Map Builder home">
          <span className="brand-mark">
            <Map size={20} aria-hidden="true" />
          </span>
          <span>Oikos Map Builder</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#vision">Vision</a>
          <a href="#builder">Create</a>
          <a href="https://loveontheworld.com" target="_blank" rel="noreferrer">
            Love on The World
          </a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <HeartHandshake size={18} aria-hidden="true" />
            Free for every believer, church, youth ministry, and disciple-maker
          </p>
          <h1>
            <span>See the people</span>
            <span>God has placed</span>
            <span>around you.</span>
          </h1>
          <p className="hero-lede">
            Build a simple, prayerful Oikos Map that turns names into intentional love, conversations, and disciple-making
            vision.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#builder">
              <Sparkles size={18} aria-hidden="true" />
              Create your map
            </a>
            <a className="secondary-action" href="#vision">
              <ArrowDownToLine size={18} aria-hidden="true" />
              Read the heart
            </a>
          </div>
          <p className="powered">
            Powered by{' '}
            <a href="https://loveontheworld.com" target="_blank" rel="noreferrer">
              Love on The World
            </a>
          </p>
        </div>

        <div className="hero-visual" aria-label="Example Oikos Map preview">
          <div className="mini-map">
            <div className="mini-node mini-center">You</div>
            {['Family', 'Friend', 'Neighbor', 'Coworker', 'Classmate'].map((label, index) => (
              <div className={`mini-node mini-${index + 1}`} key={label}>
                {label}
              </div>
            ))}
            <span className="mini-line line-1" />
            <span className="mini-line line-2" />
            <span className="mini-line line-3" />
            <span className="mini-line line-4" />
            <span className="mini-line line-5" />
          </div>
        </div>
      </section>

      <section className="vision" id="vision" aria-labelledby="vision-title">
        <div>
          <p className="section-kicker">The heart</p>
          <h2 id="vision-title">An Oikos Map helps love become specific.</h2>
        </div>
        <div className="vision-grid">
          <article>
            <span>01</span>
            <h3>Name your household</h3>
            <p>
              Oikos means household: the family, friends, classmates, coworkers, neighbors, and teammates already within
              your sphere of influence.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Pray with intention</h3>
            <p>
              When the names are visible, prayer becomes personal. You can notice open doors, follow up faithfully, and
              carry people before God by name.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>See multiplication</h3>
            <p>
              Each person has their own relationships. A map reveals how one transformed life can become a branching
              movement of hope.
            </p>
          </article>
        </div>
      </section>

      <section className="builder-section" id="builder" aria-labelledby="builder-title">
        <div className="builder-heading">
          <div>
            <p className="section-kicker">Create it here</p>
            <h2 id="builder-title">Your free custom Oikos Map</h2>
          </div>
          <div className="builder-stats" aria-label="Map stats">
            <span>{rootCount} first-circle</span>
            <span>{secondDegreeCount} next-circle</span>
            <span>{saveState}</span>
          </div>
        </div>

        <div className="builder-shell">
          <aside className="control-panel" aria-label="Oikos Map controls">
            <label>
              Map title
              <input value={mapData.mapTitle} onChange={(event) => updateMap({ mapTitle: event.target.value })} />
            </label>

            <label>
              Center name
              <input value={mapData.centerName} onChange={(event) => updateMap({ centerName: event.target.value })} />
            </label>

            <div className="button-row">
              <button type="button" onClick={() => addPerson(null)} title="Add first-circle person">
                <Plus size={18} aria-hidden="true" />
                Add person
              </button>
              <button type="button" onClick={() => selectedPerson && addPerson(selectedPerson.id)} title="Add connection">
                <CirclePlus size={18} aria-hidden="true" />
                Add branch
              </button>
            </div>

            <div className="person-editor">
              <div className="panel-title">
                <UserRound size={18} aria-hidden="true" />
                <span>{selectedPerson ? 'Selected person' : 'Select a person'}</span>
              </div>

              {selectedPerson ? (
                <>
                  <label>
                    Name
                    <input
                      value={selectedPerson.name}
                      onChange={(event) => updatePerson(selectedPerson.id, { name: event.target.value })}
                    />
                  </label>

                  <label>
                    Circle
                    <select
                      value={selectedPerson.parentId || 'first'}
                      onChange={(event) =>
                        updatePerson(selectedPerson.id, {
                          parentId: event.target.value === 'first' ? null : event.target.value,
                        })
                      }
                    >
                      <option value="first">First-circle person</option>
                      {mapData.people
                        .filter((person) => person.id !== selectedPerson.id && !person.parentId)
                        .map((person) => (
                          <option value={person.id} key={person.id}>
                            Branch from {person.name}
                          </option>
                        ))}
                    </select>
                  </label>

                  <fieldset>
                    <legend>Relationship</legend>
                    <div className="swatch-grid">
                      {groups.map((group) => (
                        <button
                          type="button"
                          className={selectedPerson.group === group.id ? 'swatch active' : 'swatch'}
                          key={group.id}
                          onClick={() => updatePerson(selectedPerson.id, { group: group.id })}
                          title={group.label}
                        >
                          <span style={{ backgroundColor: group.color }} />
                          {group.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <label>
                    Prayer focus
                    <select
                      value={selectedPerson.stage}
                      onChange={(event) => updatePerson(selectedPerson.id, { stage: event.target.value })}
                    >
                      {stages.map((stage) => (
                        <option value={stage.id} key={stage.id}>
                          {stage.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Notes
                    <textarea
                      rows="4"
                      value={selectedPerson.notes}
                      onChange={(event) => updatePerson(selectedPerson.id, { notes: event.target.value })}
                    />
                  </label>

                  <button className="danger-button" type="button" onClick={() => deletePerson(selectedPerson.id)}>
                    <Trash2 size={18} aria-hidden="true" />
                    Delete person
                  </button>
                </>
              ) : (
                <p className="muted">Add a name to begin mapping your household.</p>
              )}
            </div>

            <div className="download-actions" aria-label="Save and download actions">
              <button type="button" onClick={saveNow} title="Save in this browser">
                <Save size={18} aria-hidden="true" />
                Save
              </button>
              <button type="button" onClick={downloadPng} title="Download PNG">
                <Download size={18} aria-hidden="true" />
                PNG
              </button>
              <button type="button" onClick={downloadSvg} title="Download SVG">
                <Link2 size={18} aria-hidden="true" />
                SVG
              </button>
              <button type="button" onClick={downloadJson} title="Download editable data">
                <FileJson size={18} aria-hidden="true" />
                JSON
              </button>
              <button type="button" onClick={resetMap} title="Reset starter map">
                <RotateCcw size={18} aria-hidden="true" />
                Reset
              </button>
            </div>
          </aside>

          <div className="map-stage">
            <OikosSvg
              mapData={mapData}
              layout={layout}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              svgRef={svgRef}
            />
          </div>
        </div>
      </section>

      <section className="closing-band">
        <p>Free to use. Easy to save. Built to help ordinary people practice extraordinary love.</p>
        <a href="https://loveontheworld.com" target="_blank" rel="noreferrer">
          Powered by Love on The World
        </a>
      </section>
    </main>
  );
}

function OikosSvg({ mapData, layout, selectedId, setSelectedId, svgRef }) {
  const { width, height, center, positions } = layout;

  return (
    <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${mapData.mapTitle} Oikos Map`}>
      <defs>
        <style>{`
          .svg-title { fill: #26201c; font: 950 42px Inter, Arial, sans-serif; }
          .svg-subtitle { fill: #5c5047; font: 800 20px Inter, Arial, sans-serif; }
          .svg-center-label, .svg-person-name { fill: #26201c; font: 950 22px Inter, Arial, sans-serif; }
          .svg-center-caption, .svg-person-stage { fill: #6a5d52; font: 850 18px Inter, Arial, sans-serif; }
        `}</style>
        <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#2b2118" floodOpacity="0.16" />
        </filter>
      </defs>
      <rect width={width} height={height} rx="38" fill="#fff8ec" />
      <path
        d="M72 186 C226 72 377 88 518 160 C658 232 811 206 1005 104"
        fill="none"
        stroke="#f3cf74"
        strokeWidth="22"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M96 678 C272 552 410 617 552 550 C716 472 821 573 1000 438"
        fill="none"
        stroke="#b6e4dc"
        strokeWidth="18"
        strokeLinecap="round"
        opacity="0.65"
      />
      <text x="56" y="76" className="svg-title">
        {mapData.mapTitle}
      </text>
      <text x="56" y="112" className="svg-subtitle">
        Powered by Love on The World
      </text>

      {mapData.people.map((person) => {
        const position = positions[person.id];
        const parentPosition = person.parentId ? positions[person.parentId] : center;
        if (!position || !parentPosition) return null;
        return (
          <line
            key={`${person.id}-line`}
            x1={parentPosition.x}
            y1={parentPosition.y}
            x2={position.x}
            y2={position.y}
            stroke="#4b3f36"
            strokeWidth={person.parentId ? 3 : 5}
            strokeLinecap="round"
            opacity={person.parentId ? 0.32 : 0.45}
          />
        );
      })}

      <g filter="url(#softShadow)">
        <circle cx={center.x} cy={center.y} r="84" fill="#26201c" />
        <circle cx={center.x} cy={center.y} r="72" fill="#fffdf7" />
        <text x={center.x} y={center.y - 8} textAnchor="middle" className="svg-center-label">
          {truncateLabel(mapData.centerName, 18)}
        </text>
        <text x={center.x} y={center.y + 24} textAnchor="middle" className="svg-center-caption">
          my oikos
        </text>
      </g>

      {mapData.people.map((person) => {
        const position = positions[person.id];
        if (!position) return null;
        const group = getGroup(person.group);
        const isSelected = selectedId === person.id;
        const radius = person.parentId ? 52 : 64;
        return (
          <g
            className="map-node"
            key={person.id}
            transform={`translate(${position.x} ${position.y})`}
            onClick={() => setSelectedId(person.id)}
            onKeyDown={(event) => event.key === 'Enter' && setSelectedId(person.id)}
            tabIndex="0"
            role="button"
            aria-label={`Edit ${person.name}`}
          >
            <circle r={radius + 9} fill={isSelected ? '#171310' : '#ffffff'} opacity={isSelected ? 1 : 0.78} />
            <circle r={radius} fill={group.color} />
            <circle r={radius - 9} fill="#fffdf7" opacity="0.96" />
            <text y="-4" textAnchor="middle" className="svg-person-name">
              {truncateLabel(person.name)}
            </text>
            <text y="24" textAnchor="middle" className="svg-person-stage">
              {stages.find((stage) => stage.id === person.stage)?.label || 'Pray'}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

createRoot(document.getElementById('root')).render(<App />);
