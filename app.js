// Flashcard App - Study-Only Version with Pre-loaded Vocabulary
// This app helps kids study pre-made flashcards organized by subject and chapter

class FlashcardApp {
    constructor() {
        this.currentUser = 'vance'; // Default user
        this.userData = {
            vance: {
                subjects: [],
                settings: {
                    darkMode: false,
                    shuffle: true
                }
            },
            tucker: {
                subjects: [],
                settings: {
                    darkMode: false,
                    shuffle: true
                }
            }
        };
        
        this.currentScreen = 'home';
        this.currentSubject = null;
        this.currentChapter = null;
        this.currentDeck = null;
        this.studyCards = [];
        this.currentCardIndex = 0;
        this.isCardFlipped = false;
        this.mode = 'study'; // Always study mode
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.applyTheme();
        this.showScreen('home');
        
        // Create vocabulary data if no data exists for each user
        if (this.userData.vance.subjects.length === 0) {
            this.createVocabularyData('vance');
        }
        if (this.userData.tucker.subjects.length === 0) {
            this.createVocabularyData('tucker');
        }
        
        this.updateTitle();
    }
    
    // Data Management
    loadData() {
        // Load data for both users
        for (const user of ['vance', 'tucker']) {
            const savedData = localStorage.getItem(`flashcardData_${user}`);
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    if (parsedData.subjects) {
                        this.userData[user] = parsedData;
                    }
                    
                    // Ensure settings exist
                    if (!this.userData[user].settings) {
                        this.userData[user].settings = { darkMode: false, shuffle: true };
                    }
                } catch (e) {
                    console.error(`Error loading data for ${user}:`, e);
                }
            }
        }
        
        // Load last selected user
        const lastUser = localStorage.getItem('lastSelectedUser');
        if (lastUser && ['vance', 'tucker'].includes(lastUser)) {
            this.currentUser = lastUser;
        }
        
        // Update UI
        document.getElementById('user-select').value = this.currentUser;
    }
    
    saveData() {
        try {
            localStorage.setItem(`flashcardData_${this.currentUser}`, JSON.stringify(this.getCurrentUserData()));
            localStorage.setItem('lastSelectedUser', this.currentUser);
        } catch (e) {
            console.error('Error saving data:', e);
        }
    }
    
    getCurrentUserData() {
        return this.userData[this.currentUser];
    }
    
    switchUser(newUser) {
        if (!['vance', 'tucker'].includes(newUser)) return;
        
        this.currentUser = newUser;
        this.currentSubject = null;
        this.currentChapter = null;
        this.currentDeck = null;
        
        // Save the user preference
        localStorage.setItem('lastSelectedUser', this.currentUser);
        
        // Apply theme for current user
        this.applyTheme();
        
        // Go back to home screen
        this.showScreen('home');
        
        // Update title to show current user
        this.updateTitle();
    }
    
    updateTitle() {
        const userName = this.currentUser.charAt(0).toUpperCase() + this.currentUser.slice(1);
        document.querySelector('.app-title').textContent = `${userName}'s Flashcards`;
    }
    
    createVocabularyData(user) {
        const userData = this.userData[user];
        
        const scienceSubject = {
            id: this.generateId(),
            name: '6th Grade Texas Science',
            color: '#4CAF50',
            chapters: [
                // Chapter 0: Scientific and Engineering Practices
                {
                    id: this.generateId(),
                    name: 'Chapter 0: Scientific and Engineering Practices',
                    decks: [
                        {
                            id: this.generateId(),
                            name: 'Lesson 0.1: Scientific Practices',
                            color: '#2196F3',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'observation',
                                    back: 'the act of using one or more of your senses to gather information and take note of what occurs.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'inference',
                                    back: 'a logical explanation of an observation that is drawn from prior knowledge or experience.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'hypothesis',
                                    back: 'a possible explanation for an observation that can be tested by scientific investigations.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'independent variable',
                                    back: 'the factor that is changed by the investigator to observe how it affects a dependent variable'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'dependent variable',
                                    back: 'the factor measured or observed during an experiment'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'constants',
                                    back: 'the factors in an experiment that remain the same'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'control group',
                                    back: 'the part of an experiment that contains the same factors as the experimental group, but the independent variable is not changed.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'model',
                                    back: 'a representation of a phenomenon, a system, a process, or a solution to an engineering problem that helps people visualize or understand the concept.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'scientific theory',
                                    back: 'an explanation of observations or events based on knowledge gained from many observations and investigations.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'scientific law',
                                    back: 'a rule that describes a pattern in nature.'
                                }
                            ]
                        },
                        {
                            id: this.generateId(),
                            name: 'Lesson 0.2: Engineer Practices',
                            color: '#FF9800',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'engineering',
                                    back: 'the application of science and mathematics to solve problems.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'engineering design process',
                                    back: 'a series of steps used to find solutions to specific problems.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'criteria',
                                    back: 'are requirements or specifications for a solution to be successful.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'constraints',
                                    back: 'limitations put on the design of a solution.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'brainstorming',
                                    back: 'a problem-solving technique that involves individuals contributing ideas without the fear of being criticized.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'cost-benefit analysis',
                                    back: 'a process of comparing the predicted benefits and costs of a solution.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'prototype',
                                    back: 'is a model that is used to test a design.'
                                }
                            ]
                        },
                        {
                            id: this.generateId(),
                            name: 'Lesson 0.3: Science and Society',
                            color: '#9C27B0',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'accuracy',
                                    back: 'a description of how close a measurement is to an accepted value.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'credibility',
                                    back: 'is the confidence that can be placed in the truth of scientific findings.'
                                }
                            ]
                        }
                    ]
                },
                // Chapter 1: Classification of Matter
                {
                    id: this.generateId(),
                    name: 'Chapter 1: Classification of Matter',
                    decks: [
                        {
                            id: this.generateId(),
                            name: 'Lesson 1.1: Solids, Liquids, and Gases',
                            color: '#E91E63',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'atom',
                                    back: 'a small particle that is the building block of matter.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'molecule',
                                    back: 'two or more atoms that are held together and that act as a unit.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'structure',
                                    back: 'the way matter is arranged.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'shape',
                                    back: 'an object\'s form'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'kinetic energy',
                                    back: 'the energy an object has due to its motion.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'volume',
                                    back: 'the amount of space a substance takes up.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'solid',
                                    back: 'matter that has a definite shape and a definite volume.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'liquid',
                                    back: 'matter with a definite volume but no definite shape.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'gas',
                                    back: 'matter that has no definite volume and no definite shape.'
                                }
                            ]
                        },
                        {
                            id: this.generateId(),
                            name: 'Lesson 1.2: Density',
                            color: '#E91E63',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'substance',
                                    back: 'matter with a composition that is always the same.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'physical property',
                                    back: 'a characteristic of matter that can be observed or measured without changing the identity of the matter.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'mass',
                                    back: 'the amount of matter in an object.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'weight',
                                    back: 'the gravitational pull on the mass of an object.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'density',
                                    back: 'the mass per unit volume of a substance.'
                                }
                            ]
                        },
                        {
                            id: this.generateId(),
                            name: 'Lesson 1.3: The Periodic Table',
                            color: '#E91E63',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'periodic table',
                                    back: 'a chart of the elements arranged into rows and columns according to their physical and chemical properties.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'metal',
                                    back: 'an element that is generally shiny and is easily pulled into wires or hammered into thin sheets.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'ductility',
                                    back: 'the ability of a substance to be pulled into thin wires.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'malleability',
                                    back: 'the ability of a substance to be hammered or rolled into sheets.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'nonmetal',
                                    back: 'elements that have no metallic properties.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'metalloid',
                                    back: 'an element that has physical and chemical properties of both metals and nonmetals.'
                                }
                            ]
                        }
                    ]
                },
                // Chapter 2: Interactions of Matter
                {
                    id: this.generateId(),
                    name: 'Chapter 2: Interactions of Matter',
                    decks: [
                        {
                            id: this.generateId(),
                            name: 'Lesson 2.1: Pure Substances and Mixtures',
                            color: '#3F51B5',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'matter',
                                    back: 'anything that has mass and takes up space'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'pure substance',
                                    back: 'matter with a composition that is always the same.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'mixture',
                                    back: 'two or more substances that are physically blended but do not combine chemically.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'physical property',
                                    back: 'a characteristic of matter that can be observed or measured without changing the identity of the matter.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'heterogeneous mixture',
                                    back: 'a mixture in which two or more pure substances are not evenly mixed.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'homogeneous mixture',
                                    back: 'a mixture in which two or more pure substances are evenly mixed.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'solution',
                                    back: 'another name for a homogeneous mixture.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'dissolve',
                                    back: 'to form a solution by mixing evenly.'
                                }
                            ]
                        },
                        {
                            id: this.generateId(),
                            name: 'Lesson 2.2: Chemical Changes',
                            color: '#3F51B5',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'physical change',
                                    back: 'a change in size, shape, form, or state of matter that does not change the matter\'s identity.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'chemical change',
                                    back: 'a change in matter in which the substances that make up the matter change into other substances with different chemical and physical properties.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'chemical property',
                                    back: 'the ability or inability of a substance to combine with or change into one or more new substances.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'law of conservation of mass',
                                    back: 'law that states that the total mass of the substances before a chemical change is the same as the total mass of the substances after the chemical change.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'thermal energy',
                                    back: 'the result of the motion of all the particles, and the distance and attractions between those particles in the system.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'precipitate',
                                    back: 'a solid that sometimes forms when two liquid solutions combine.'
                                }
                            ]
                        }
                    ]
                },
                // Chapter 3: Forces and Their Interactions
                {
                    id: this.generateId(),
                    name: 'Chapter 3: Forces and Their Interactions',
                    decks: [
                        {
                            id: this.generateId(),
                            name: 'Lesson 3.1: Identifying Forces',
                            color: '#00BCD4',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'force',
                                    back: 'a push or a pull on an object.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'contact force',
                                    back: 'a push or a pull on one object by another object that is touching it.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'applied force',
                                    back: 'a force in which one object directly pushes or pulls on another object.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'friction',
                                    back: 'a contact force that resists the sliding motion of two surfaces that are touching.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'normal force',
                                    back: 'the support force exerted on an object that touches another stable object.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'noncontact force',
                                    back: 'a force that one object can apply to another object without touching it.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'gravity',
                                    back: 'an attractive force that exists between all objects that have mass.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'magnetism',
                                    back: 'the force exerted by magnets when they repel or attract one another'
                                }
                            ]
                        },
                        {
                            id: this.generateId(),
                            name: 'Lesson 3.2: Balanced and Unbalanced Forces',
                            color: '#00BCD4',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'net force',
                                    back: 'the combination of all the forces acting on an object.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'balanced force',
                                    back: 'forces acting on an object that combine and form a net force of zero.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'unbalanced force',
                                    back: 'forces acting on an object that combine and form a net force that is not zero.'
                                }
                            ]
                        },
                        {
                            id: this.generateId(),
                            name: 'Lesson 3.3: Third Law of Motion',
                            color: '#00BCD4',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'force pair',
                                    back: 'the forces two objects apply to each other.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'Newton\'s third law of motion',
                                    back: 'when an object applies a force on another object, the second object applies a force of the same strength on the first object but the force is in the opposite direction.'
                                }
                            ]
                        }
                    ]
                },
                // Chapter 4: Conservation of Energy
                {
                    id: this.generateId(),
                    name: 'Chapter 4: Conservation of Energy',
                    decks: [
                        {
                            id: this.generateId(),
                            name: 'Lesson 4.1: Kinetic and Potential Energy',
                            color: '#009688',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'energy',
                                    back: 'the ability to cause change.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'work',
                                    back: 'the transfer of energy to an object by a force that makes an object move in the direction of the force.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'kinetic energy',
                                    back: 'energy due to motion.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'potential energy',
                                    back: 'stored energy due to the interactions between objects or particles.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'gravitational potential energy',
                                    back: 'stored energy due to the interactions of objects in a gravitational field.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'elastic potential energy',
                                    back: 'energy stored in objects that are compressed or stretched, such as springs and rubber bands.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'chemical potential energy',
                                    back: 'the energy released when atoms form connections.'
                                }
                            ]
                        },
                        {
                            id: this.generateId(),
                            name: 'Lesson 4.2: Energy Transfer and Transformation',
                            color: '#009688',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'system',
                                    back: 'a collection of objects that interact in some way.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'law of conservation of energy',
                                    back: 'states that energy is always transferring or transforming, but energy is not created or destroyed.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'energy transfer',
                                    back: 'occurs when energy is moved from one object to another.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'energy transformation',
                                    back: 'occurs when energy is changed from one form to another.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'source object',
                                    back: 'the object that provides energy for energy transfer.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'receiver object',
                                    back: 'the object that gains energy from the energy transfer.'
                                }
                            ]
                        },
                        {
                            id: this.generateId(),
                            name: 'Lesson 4.3: Transferring Energy Through Waves',
                            color: '#009688',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'wave',
                                    back: 'a disturbance that transfers energy from one place to another without transferring matter.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'mechanical wave',
                                    back: 'a wave that can travel only through matter.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'medium',
                                    back: 'a material in which a wave travels.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'transverse wave',
                                    back: 'a wave in which the disturbance is perpendicular to the direction the wave travels.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'longitudinal wave',
                                    back: 'a wave in which the disturbance is parallel to the direction the wave travels.'
                                }
                            ]
                        }
                    ]
                },
                // Chapter 5: The Sun-Earth-Moon System
                {
                    id: this.generateId(),
                    name: 'Chapter 5: The Sun-Earth-Moon System',
                    decks: [
                        {
                            id: this.generateId(),
                            name: 'Lesson 5.1: Earth\'s Revolution and Seasons',
                            color: '#8BC34A',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'orbit',
                                    back: 'the path an object follows as it moves around another object.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'revolution',
                                    back: 'the orbit of one object around another object.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'gravity',
                                    back: 'an attractive force that exists between all objects that have mass.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'rotation',
                                    back: 'the spin of an object around its axis.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'rotation axis',
                                    back: 'the line around which an object rotates.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'intensity',
                                    back: 'the amount of energy that passes through a square meter of space in one second.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'equator',
                                    back: 'the imaginary line that divides Earth into the Northern and Southern Hemispheres'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'solstice',
                                    back: 'when Earth\'s rotation axis is tilted directly toward or away from the Sun.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'equinox',
                                    back: 'when Earth\'s rotation axis is tilted neither toward nor away from the Sun.'
                                }
                            ]
                        },
                        {
                            id: this.generateId(),
                            name: 'Lesson 5.2: Ocean Tides',
                            color: '#8BC34A',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'ocean tide',
                                    back: 'the periodic rise and fall of the ocean\'s surface caused by the gravitational force between Earth and the Moon, and Earth and the Sun.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'daily tide',
                                    back: 'the predictable rise and fall of the ocean\'s surface each day.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'high tide',
                                    back: 'when the ocean\'s surface reaches its highest point.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'low tide',
                                    back: 'when the ocean\'s surface reaches its lowest point.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'tidal range',
                                    back: 'the difference in water height between a high tide and a low tide.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'spring tide',
                                    back: 'the largest tidal range that occurs when the Sun, Earth, and the Moon form a straight line.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'neap tide',
                                    back: 'the lowest tidal range that occurs when the Sun, Earth, and the Moon form a right angle.'
                                }
                            ]
                        }
                    ]
                },
                // Chapter 6: Earth's Structure
                {
                    id: this.generateId(),
                    name: 'Chapter 6: Earth\'s Structure',
                    decks: [
                        {
                            id: this.generateId(),
                            name: 'Lesson 6.1: Earth\'s Spheres',
                            color: '#CDDC39',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'biosphere',
                                    back: 'all the parts of Earth where there is life.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'geosphere',
                                    back: 'Earth\'s solid and molten rocks, soil and sediment.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'sediment',
                                    back: 'material that forms when rocks are broken down into smaller pieces or dissolved in water.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'magma',
                                    back: 'molten or liquid rock underground.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'volcano',
                                    back: 'a vent in Earth\'s crust through which molten rock flows.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'lava',
                                    back: 'molten rock that erupts on Earth\'s surface.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'hydrosphere',
                                    back: 'system containing all the solid and liquid water on Earth.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'atmosphere',
                                    back: 'the layer of gases surrounding Earth.'
                                }
                            ]
                        },
                        {
                            id: this.generateId(),
                            name: 'Lesson 6.2: Earth\'s Layers',
                            color: '#CDDC39',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'crust',
                                    back: 'the brittle, rocky, least dense, outer layer of Earth.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'mantle',
                                    back: 'the thick middle layer in the solid part of Earth.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'core',
                                    back: 'the dense metallic center of Earth.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'outer core',
                                    back: 'the liquid layer surrounding the inner core, mostly composed of liquid iron and nickel.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'inner core',
                                    back: 'the innermost geologic layer of Earth, a dense ball of solid iron crystals.'
                                }
                            ]
                        },
                        {
                            id: this.generateId(),
                            name: 'Lesson 6.3: The Rock Cycle',
                            color: '#CDDC39',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'igneous rock',
                                    back: 'rocks that form when magma or lava cools and crystallizes.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'sedimentary rock',
                                    back: 'rocks that form from the deposition and accumulation of pieces of pre-existing rock, chemical precipitates, and parts of once-living organisms.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'compaction',
                                    back: 'a process in which the weight from the layers of sediment forces out fluids and decreases the space between sediment grains.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'cementation',
                                    back: 'a process in which minerals dissolved in water crystallize between sediment grains.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'metamorphic rock',
                                    back: 'rocks that form without melting, when pre-existing rocks experience high heat, pressure, or react with fluids.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'rock cycle',
                                    back: 'the series of processes that change one type of rock into another type of rock.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'uplift',
                                    back: 'the process that moves large bodies of Earth materials to higher elevations.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'weathering',
                                    back: 'the mechanical and chemical processes that change Earth\'s surface over time.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'erosion',
                                    back: 'when broken down pieces of rocks are transported.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'deposition',
                                    back: 'when transported sediment accumulates into layers, such as at the bottom of lakes, the ocean, along beaches, or in river valleys.'
                                }
                            ]
                        }
                    ]
                },
                // Chapter 7: Earth's Resources
                {
                    id: this.generateId(),
                    name: 'Chapter 7: Earth\'s Resources',
                    decks: [
                        {
                            id: this.generateId(),
                            name: 'Lesson 7.1: Resource Management and Conservation',
                            color: '#FFC107',
                            cards: [
                                // Add vocabulary when provided
                            ]
                        },
                        {
                            id: this.generateId(),
                            name: 'Lesson 7.2: Global Impacts of Resource Management',
                            color: '#FFC107',
                            cards: [
                                // Add vocabulary when provided
                            ]
                        }
                    ]
                },
                // Chapter 8: Living Systems and the Environment
                {
                    id: this.generateId(),
                    name: 'Chapter 8: Living Systems and the Environment',
                    decks: [
                        {
                            id: this.generateId(),
                            name: 'Lesson 8.1: Levels of Organization in Ecosystems',
                            color: '#FF5722',
                            cards: [
                                // Add vocabulary when provided
                            ]
                        },
                        {
                            id: this.generateId(),
                            name: 'Lesson 8.2: Dependence On and Competition for Resources',
                            color: '#FF5722',
                            cards: [
                                // Add vocabulary when provided
                            ]
                        },
                        {
                            id: this.generateId(),
                            name: 'Lesson 8.3: Relationships Between Organisms',
                            color: '#FF5722',
                            cards: [
                                // Add vocabulary when provided
                            ]
                        }
                    ]
                },
                // Chapter 9: Organisms and Variations
                {
                    id: this.generateId(),
                    name: 'Chapter 9: Organisms and Variations',
                    decks: [
                        {
                            id: this.generateId(),
                            name: 'Lesson 9.1: Cell Theory',
                            color: '#795548',
                            cards: [
                                // Add vocabulary when provided
                            ]
                        },
                        {
                            id: this.generateId(),
                            name: 'Lesson 9.2: Characteristics of Organisms',
                            color: '#795548',
                            cards: [
                                // Add vocabulary when provided
                            ]
                        },
                        {
                            id: this.generateId(),
                            name: 'Lesson 9.3: Variations in Populations',
                            color: '#795548',
                            cards: [
                                // Add vocabulary when provided
                            ]
                        }
                    ]
                }
            ]
        };
        
        userData.subjects.push(scienceSubject);
        
        // Save data for this specific user
        try {
            localStorage.setItem(`flashcardData_${user}`, JSON.stringify(userData));
        } catch (e) {
            console.error(`Error saving vocabulary data for ${user}:`, e);
        }
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Event Listeners Setup
    setupEventListeners() {
        // Home screen button - only study now
        document.getElementById('study-cards-btn').addEventListener('click', () => {
            this.showSubjectList();
        });
        
        // User switcher
        document.getElementById('user-select').addEventListener('change', (e) => {
            this.switchUser(e.target.value);
        });
        
        // Header controls
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Navigation
        document.getElementById('back-to-home-subjects').addEventListener('click', () => {
            this.showScreen('home');
        });
        
        document.getElementById('back-to-subjects').addEventListener('click', () => {
            this.showSubjectList();
        });
        
        
        document.getElementById('back-from-study').addEventListener('click', () => {
            this.showLessonList();
        });
        
        document.getElementById('back-to-chapters').addEventListener('click', () => {
            this.showChapterList();
        });
        
        // Study controls
        document.getElementById('flip-card').addEventListener('click', () => {
            this.flipCard();
        });
        
        document.getElementById('got-it').addEventListener('click', () => {
            this.answerCard(true);
        });
        
        document.getElementById('try-again').addEventListener('click', () => {
            this.answerCard(false);
        });
        
        document.getElementById('shuffle-checkbox').addEventListener('change', (e) => {
            this.getCurrentUserData().settings.shuffle = e.target.checked;
            this.saveData();
            if (this.studyCards.length > 0) {
                this.setupStudySession();
            }
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts in study mode
            if (this.currentScreen !== 'study') return;
            
            switch(e.key) {
                case ' ': // Spacebar to flip card
                    e.preventDefault();
                    this.flipCard();
                    break;
                case 'ArrowRight': // Right arrow for "Got it"
                    e.preventDefault();
                    if (this.isCardFlipped) {
                        this.answerCard(true);
                    }
                    break;
                case 'ArrowLeft': // Left arrow for "Try again"
                    e.preventDefault();
                    if (this.isCardFlipped) {
                        this.answerCard(false);
                    }
                    break;
            }
        });
    }
    
    // Screen Management
    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show selected screen
        document.getElementById(`${screenName}-screen`).classList.add('active');
        this.currentScreen = screenName;
    }
    
    showSubjectList() {
        document.getElementById('subject-list-title').textContent = 'Choose a Subject to Study';
        this.showScreen('subject-list');
        this.updateSubjectList();
    }
    
    showChapterList() {
        if (!this.currentSubject) return;
        
        document.getElementById('chapter-list-title').textContent = 
            `${this.currentSubject.name} - Choose a Chapter`;
        this.showScreen('chapter-list');
        this.updateChapterList();
    }
    
    showLessonList() {
        if (!this.currentChapter) return;
        
        document.getElementById('lesson-list-title').textContent = 
            `${this.currentChapter.name} - Choose a Lesson`;
        this.showScreen('lesson-list');
        this.updateLessonList();
    }
    
    
    updateSubjectList() {
        const subjectList = document.getElementById('subject-list');
        const subjects = this.getCurrentUserData().subjects;
        
        if (subjects.length === 0) {
            subjectList.innerHTML = `
                <div class="empty-state">
                    <h3>No subjects available!</h3>
                    <p>Vocabulary will be added soon.</p>
                </div>
            `;
            return;
        }
        
        subjectList.innerHTML = subjects.map(subject => {
            const totalCards = subject.chapters.reduce((total, chapter) => {
                return total + chapter.decks.reduce((chapterTotal, deck) => {
                    return chapterTotal + deck.cards.length;
                }, 0);
            }, 0);
            
            return `
                <div class="deck-card subject-card" data-subject-id="${subject.id}" tabindex="0">
                    <div class="deck-color" style="background-color: ${subject.color}"></div>
                    <div class="deck-header">
                        <h3 class="deck-name">${this.escapeHtml(subject.name)}</h3>
                    </div>
                    <div class="deck-info">
                        ${subject.chapters.length} chapter${subject.chapters.length !== 1 ? 's' : ''} • 
                        ${totalCards} vocabulary word${totalCards !== 1 ? 's' : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        // Add event listeners for subject cards
        subjectList.querySelectorAll('.subject-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const subjectId = card.dataset.subjectId;
                this.selectSubject(subjectId);
            });
        });
    }
    
    updateChapterList() {
        const chapterList = document.getElementById('chapter-list');
        
        if (this.currentSubject.chapters.length === 0) {
            chapterList.innerHTML = `
                <div class="empty-state">
                    <h3>No chapters available!</h3>
                    <p>Vocabulary chapters will be added soon.</p>
                </div>
            `;
            return;
        }
        
        chapterList.innerHTML = this.currentSubject.chapters.map(chapter => {
            const totalCards = chapter.decks.reduce((total, deck) => {
                return total + deck.cards.length;
            }, 0);
            
            return `
                <div class="deck-card chapter-card" data-chapter-id="${chapter.id}" tabindex="0">
                    <div class="deck-color" style="background-color: ${this.currentSubject.color}; opacity: 0.7;"></div>
                    <div class="deck-header">
                        <h3 class="deck-name">${this.escapeHtml(chapter.name)}</h3>
                    </div>
                    <div class="deck-info">
                        ${chapter.decks.length} deck${chapter.decks.length !== 1 ? 's' : ''} • 
                        ${totalCards} vocabulary word${totalCards !== 1 ? 's' : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        // Add event listeners for chapter cards
        chapterList.querySelectorAll('.chapter-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const chapterId = card.dataset.chapterId;
                this.selectChapter(chapterId);
            });
        });
    }
    
    updateLessonList() {
        const lessonList = document.getElementById('lesson-list');
        
        if (this.currentChapter.decks.length === 0) {
            lessonList.innerHTML = `
                <div class="empty-state">
                    <h3>No lessons available!</h3>
                    <p>Vocabulary lessons will be added soon.</p>
                </div>
            `;
            return;
        }
        
        lessonList.innerHTML = this.currentChapter.decks.map(deck => {
            const totalCards = deck.cards.length;
            
            return `
                <div class="deck-card lesson-card" data-lesson-id="${deck.id}" tabindex="0">
                    <div class="deck-color" style="background-color: ${deck.color};"></div>
                    <div class="deck-header">
                        <h3 class="deck-name">${this.escapeHtml(deck.name)}</h3>
                    </div>
                    <div class="deck-info">
                        ${totalCards} vocabulary word${totalCards !== 1 ? 's' : ''}
                        ${totalCards === 0 ? ' (Coming Soon)' : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        // Add event listeners for lesson cards
        lessonList.querySelectorAll('.lesson-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const lessonId = card.dataset.lessonId;
                this.selectLesson(lessonId);
            });
        });
    }
    
    
    updateStudyScreen() {
        if (!this.currentDeck) return;
        
        // Desktop - show full breadcrumbs
        document.getElementById('study-deck-name').textContent = 
            `${this.currentSubject.name} > ${this.currentChapter.name} > ${this.currentDeck.name}`;
        
        // Mobile - show just chapter name
        document.getElementById('study-deck-name-mobile').textContent = this.currentChapter.name;
        document.getElementById('shuffle-checkbox').checked = this.getCurrentUserData().settings.shuffle;
        
        this.setupStudySession();
        this.showCurrentCard();
    }
    
    // Navigation Methods
    selectSubject(subjectId) {
        this.currentSubject = this.getCurrentUserData().subjects.find(subject => subject.id === subjectId);
        if (!this.currentSubject) return;
        
        this.showChapterList();
    }
    
    selectChapter(chapterId) {
        this.currentChapter = this.currentSubject.chapters.find(chapter => chapter.id === chapterId);
        if (!this.currentChapter) return;
        
        this.showLessonList();
    }
    
    selectLesson(lessonId) {
        this.currentDeck = this.currentChapter.decks.find(deck => deck.id === lessonId);
        if (!this.currentDeck) return;
        
        if (this.currentDeck.cards.length === 0) {
            alert('This lesson has no vocabulary words yet!');
            return;
        }
        
        this.showScreen('study');
        this.updateStudyScreen();
    }
    
    
    // Study Mode
    setupStudySession() {
        this.studyCards = [...this.currentDeck.cards];
        
        if (this.getCurrentUserData().settings.shuffle) {
            this.shuffleArray(this.studyCards);
        }
        
        this.currentCardIndex = 0;
        this.isCardFlipped = false;
        
        if (this.studyCards.length === 0) {
            alert('This deck has no vocabulary words!');
            return;
        }
    }
    
    showCurrentCard() {
        if (this.currentCardIndex >= this.studyCards.length) {
            this.finishStudySession();
            return;
        }
        
        const card = this.studyCards[this.currentCardIndex];
        
        // Update progress
        const progress = ((this.currentCardIndex + 1) / this.studyCards.length) * 100;
        document.getElementById('progress-text').textContent = 
            `${this.currentCardIndex + 1} of ${this.studyCards.length}`;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        
        // Show card content
        document.getElementById('card-front-text').textContent = card.front;
        document.getElementById('card-back-text').textContent = card.back;
        
        // Reset card state
        document.getElementById('flashcard').classList.remove('flipped');
        document.getElementById('flip-card').style.display = 'block';
        document.getElementById('answer-buttons').classList.add('hidden');
        this.isCardFlipped = false;
    }
    
    flipCard() {
        if (this.isCardFlipped) return;
        
        document.getElementById('flashcard').classList.add('flipped');
        document.getElementById('flip-card').style.display = 'none';
        document.getElementById('answer-buttons').classList.remove('hidden');
        this.isCardFlipped = true;
    }
    
    answerCard(gotIt) {
        if (!this.isCardFlipped) return;
        
        // If they didn't get it, add the card back to the end of the study session
        if (!gotIt) {
            this.studyCards.push(this.studyCards[this.currentCardIndex]);
        }
        
        this.currentCardIndex++;
        this.showCurrentCard();
    }
    
    finishStudySession() {
        const totalCards = this.currentDeck.cards.length;
        alert(`Great job! You studied all ${totalCards} vocabulary words in "${this.currentChapter.name}".`);
        this.showChapterList();
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    // Theme Management
    toggleTheme() {
        this.getCurrentUserData().settings.darkMode = !this.getCurrentUserData().settings.darkMode;
        this.saveData();
        this.applyTheme();
    }
    
    applyTheme() {
        if (this.getCurrentUserData().settings.darkMode) {
            document.body.setAttribute('data-theme', 'dark');
            document.getElementById('theme-toggle').textContent = '☀️';
        } else {
            document.body.removeAttribute('data-theme');
            document.getElementById('theme-toggle').textContent = '🌙';
        }
    }
    
    // Utility Functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FlashcardApp();
});