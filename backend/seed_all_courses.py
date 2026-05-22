import os
from supabase import create_client, Client
from fastembed import TextEmbedding
from dotenv import load_dotenv

# Load Env
load_dotenv()
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize Embedding Model
print("Loading AI Embedding Model (this is fast)...")
embedding_model = TextEmbedding()

CURRICULUM = [
    {
        "trade_domain": "AC Technician",
        "description": "Master HVAC/R systems, thermodynamics, refrigerant management, and advanced electrical diagnostics.",
        "modules": [
            {
                "module_number": 1,
                "title": "Thermodynamics & Refrigeration Cycle",
                "text": "The refrigeration cycle consists of four primary components: the compressor, condenser, metering device, and evaporator. The compressor pressurizes the low-pressure refrigerant gas, turning it into a high-pressure, high-temperature gas. It flows into the condenser, where it rejects heat to the outside air and condenses into a high-pressure liquid. This liquid passes through the metering device (like a TXV or capillary tube), which drops the pressure and temperature. The low-pressure mixture enters the evaporator, absorbing heat from the indoor air, boiling back into a gas, and returning to the compressor. Understanding superheat (sensible heat added to the vapor past its boiling point) and subcooling (sensible heat removed from the liquid below its condensing point) is critical for diagnosing system charge."
            },
            {
                "module_number": 2,
                "title": "Refrigerant Handling & Recovery",
                "text": "EPA Section 608 regulations strictly prohibit the intentional venting of ODS (Ozone Depleting Substances) and substitute refrigerants like HFCs. Always use a certified recovery machine and a DOT-approved recovery cylinder. Never fill a recovery cylinder past 80% of its water capacity to allow for thermal expansion. When recovering refrigerant, use the push-pull method for bulk liquid transfer. Always pull a deep vacuum down to 500 microns using a dual-stage vacuum pump and a micron gauge to remove moisture and non-condensables before recharging a system. Moisture mixed with refrigerant oil creates harmful acids that destroy compressor windings."
            },
            {
                "module_number": 3,
                "title": "Electrical Diagnostics in HVAC",
                "text": "HVAC systems rely heavily on electrical controls. Use a true-RMS multimeter to measure voltage, amperage, and resistance. A common failure point is the dual run capacitor, which provides phase-shifting for the compressor and condenser fan motors. To test a capacitor, discharge it safely, set the meter to capacitance (MFD), and read across the terminals. If the reading is outside the +/- 5% tolerance, replace it. When diagnosing a compressor, measure the resistance between Common (C), Start (S), and Run (R). The resistance of C-to-S plus C-to-R should exactly equal S-to-R. Infinite resistance indicates an open winding."
            },
            {
                "module_number": 4,
                "title": "Airflow & Psychrometrics",
                "text": "Proper airflow is measured in CFM (Cubic Feet per Minute) and is essential for system efficiency. Rule of thumb dictates 400 CFM per ton of cooling. Measure static pressure using a digital manometer and a pitot tube. Total External Static Pressure (TESP) is the absolute sum of the return static (negative pressure) and the supply static (positive pressure). High TESP indicates restrictions, such as dirty filters or undersized ductwork, which leads to frozen evaporator coils. Psychrometrics is the study of moist air properties; always measure the wet-bulb and dry-bulb temperatures of the return air to determine the target superheat for fixed-orifice systems."
            },
            {
                "module_number": 5,
                "title": "Advanced Troubleshooting Matrix",
                "text": "If a system has low suction pressure and low head pressure, it usually indicates a low refrigerant charge or low load conditions. If it has low suction pressure but high head pressure, look for a liquid line restriction such as a clogged filter drier or failing TXV. High suction and high head pressure point to an overcharge or poor condenser airflow (dirty condenser coil). Always verify electrical integrity before diagnosing the refrigerant circuit. Ensure the contactor pulls in cleanly without pitting, and verify the low-voltage control circuit is providing a steady 24VAC from the transformer."
            }
        ]
    },
    {
        "trade_domain": "Electrician",
        "description": "Comprehensive electrical theory, NEC compliance, circuit planning, and industrial load management.",
        "modules": [
            {
                "module_number": 1,
                "title": "Ohm's Law & Circuit Theory",
                "text": "Ohm's Law defines the relationship between Voltage (V), Current (I), and Resistance (R), stated as V = I x R. In a series circuit, current remains constant throughout, while voltage drops across each resistor. In a parallel circuit, voltage is constant across all branches, but the current divides based on the resistance of each branch. Power (Watts) is calculated as P = V x I. Understanding these fundamental principles is essential for calculating circuit loads and preventing wire overheating. Always de-rate wire ampacity if ambient temperatures exceed 86 degrees Fahrenheit or if more than three current-carrying conductors are in a single raceway."
            },
            {
                "module_number": 2,
                "title": "NEC Standards & Load Calculations",
                "text": "The National Electrical Code (NEC) mandates safety standards. For a residential service calculation, general lighting load is calculated at 3 Volt-Amperes (VA) per square foot. Small appliance branch circuits must be rated at 1500 VA each. Continuous loads (running for 3 hours or more) must have branch circuits sized at 125% of the load. For example, a 20-amp continuous load requires wire and breakers rated for 25 amps. Always ensure the neutral conductor is sized to handle the maximum unbalanced load. In industrial settings, motor loads require the feeder to be sized at 125% of the largest motor's Full Load Amperage (FLA) plus 100% of all other motors."
            },
            {
                "module_number": 3,
                "title": "Grounding and Bonding",
                "text": "Grounding and bonding are distinct but related concepts. Grounding refers to the connection of the electrical system to the earth via a grounding electrode (like a copper rod driven 8 feet into the soil). This protects against lightning and high-voltage surges. Bonding is the connection of all non-current-carrying metal parts (conduit, enclosures, pipes) together to establish a low-impedance fault current path back to the main service panel. If a live wire touches a bonded metal casing, the low resistance guarantees a massive spike in current, which instantly trips the circuit breaker and prevents electrocution. Never bond the neutral and ground wires anywhere except at the main service equipment."
            },
            {
                "module_number": 4,
                "title": "Circuit Breakers and Panels",
                "text": "Circuit breakers provide both thermal and magnetic protection. Thermal protection uses a bimetallic strip that bends and trips the breaker during prolonged overloads. Magnetic protection uses an electromagnet to trip the breaker instantaneously during a dead short circuit. When installing a subpanel, you must run a 4-wire feed (two hots, one neutral, one ground) and you must completely isolate the neutral bus bar from the ground bus bar. AFCI (Arc-Fault Circuit Interrupter) breakers detect dangerous electrical arcing to prevent fires, while GFCI (Ground-Fault Circuit Interrupter) breakers detect current leakage as small as 5 milliamps to prevent fatal shocks in wet areas."
            },
            {
                "module_number": 5,
                "title": "Industrial Motor Controls",
                "text": "Industrial machinery relies on 3-phase power and magnetic motor starters. A motor starter consists of a contactor (which handles the high current) and an overload relay (which protects the motor from overheating). The control circuit operates at a lower voltage (e.g., 24V or 120V) to energize the contactor coil. A standard '3-wire control' circuit uses a momentary normally-closed STOP button, a momentary normally-open START button, and a holding contact (auxiliary contact) wired in parallel with the START button. When START is pressed, the coil energizes and the holding contact closes, keeping the motor running even when the START button is released."
            }
        ]
    },
    {
        "trade_domain": "Plumber",
        "description": "Fluid dynamics, advanced piping materials, pressure regulation, and sanitation compliance.",
        "modules": [
            {
                "module_number": 1,
                "title": "Fluid Dynamics and Water Pressure",
                "text": "Water pressure is measured in PSI (Pounds per Square Inch). Standard residential water pressure should be maintained between 40 and 80 PSI. Pressures exceeding 80 PSI can severely damage fixtures, burst washing machine hoses, and cause 'water hammer' (hydraulic shock) when valves close suddenly. To control high pressure, install a Pressure Reducing Valve (PRV) on the main incoming line. Conversely, low pressure is often caused by calcification in galvanized steel pipes or partially closed gate valves. Water hammer arrestors should be installed near fast-acting solenoid valves to absorb shock waves using a sealed air cushion."
            },
            {
                "module_number": 2,
                "title": "Piping Materials & Joining Methods",
                "text": "Modern plumbing utilizes various materials. PEX (Cross-linked Polyethylene) is highly flexible, resists freezing, and is joined using crimp rings or expansion fittings. Copper is traditional and highly durable; joining copper requires flux to prevent oxidation, followed by sweating (soldering) with lead-free solder. PVC (Polyvinyl Chloride) is used strictly for cold water and DWV (Drain, Waste, Vent) systems, joined using chemical solvent welding (primer and cement). CPVC can handle hot water. When joining dissimilar metals, like copper to galvanized steel, you must use a dielectric union to prevent galvanic corrosion, which would rapidly destroy the pipes."
            },
            {
                "module_number": 3,
                "title": "Drain, Waste, and Vent (DWV) Systems",
                "text": "The DWV system relies entirely on gravity and air pressure. Drain pipes must be installed with a minimum slope of 1/4 inch per foot to ensure solids and liquids flow together. If the slope is too steep, water outruns the solids; if too flat, standing water causes clogs. Every fixture must have a P-trap. The P-trap holds a plug of water that prevents toxic sewer gases (like methane and hydrogen sulfide) from entering the building. To prevent the vacuum of rushing water from siphoning the water out of the P-trap, a vent pipe must be installed to admit atmospheric air into the drain line behind the fixture."
            },
            {
                "module_number": 4,
                "title": "Water Heater Installation & Diagnostics",
                "text": "Tank water heaters heat water via electric elements or gas burners. A critical safety device on every water heater is the T&P (Temperature and Pressure) Relief Valve. If the thermostat fails and water boils, the T&P valve opens to discharge water, preventing the tank from exploding like a bomb. It typically activates at 210 degrees Fahrenheit or 150 PSI. For gas water heaters, ensure proper drafting of carbon monoxide through the flue. For electric heaters, diagnosing lack of hot water involves using a multimeter to check for 240V at the upper thermostat, then verifying the resistance of the heating elements (usually 12-16 ohms)."
            },
            {
                "module_number": 5,
                "title": "Sanitation Code and Backflow Prevention",
                "text": "Protecting the potable (drinking) water supply from contamination is the plumber's highest duty. Cross-connections occur when potable water lines are connected to non-potable sources. To prevent back-siphonage (when a drop in city pressure sucks contaminated water backward), plumbers use vacuum breakers on hose bibs. To prevent back-pressure (when a boiler pushes water backward into the city line), a Reduced Pressure Zone (RPZ) backflow preventer must be installed and tested annually. Air gaps—the physical distance between the water outlet and the flood rim of a sink—are the most foolproof method of backflow prevention."
            }
        ]
    },
    {
        "trade_domain": "Welder",
        "description": "Metallurgy, arc physics, joint design, and mastery of MIG, TIG, and Stick processes.",
        "modules": [
            {
                "module_number": 1,
                "title": "Arc Physics and Safety",
                "text": "Welding creates an electrical arc between an electrode and the base metal, generating temperatures exceeding 6,000 degrees Fahrenheit. This intense heat melts both metals, creating a weld pool. Arc welding emits dangerous ultraviolet (UV) and infrared (IR) radiation. You must wear an auto-darkening welding helmet with at least a Shade 10 filter to prevent 'arc eye' (flash burns on the cornea). Fire-resistant PPE, such as leather jackets and gauntlet gloves, are required to protect against spatter. Proper ventilation is critical; welding galvanized steel produces toxic zinc oxide fumes that cause heavy metal fever."
            },
            {
                "module_number": 2,
                "title": "SMAW (Stick Welding) Mastery",
                "text": "Shielded Metal Arc Welding (SMAW) uses a consumable flux-coated electrode. When the arc is struck, the flux burns to create a shielding gas (displacing oxygen) and forms a protective layer of slag over the cooling weld pool. Common electrodes include 6010 (deep penetration, fast-freezing, great for rusty metal or root passes) and 7018 (low-hydrogen, high-strength, smooth bead, used for structural steel). The first two digits indicate tensile strength in thousands of PSI (e.g., 70,000 PSI for 7018). Maintaining the correct arc length—roughly the diameter of the bare electrode—is critical for preventing porosity and arc wander."
            },
            {
                "module_number": 3,
                "title": "GMAW (MIG Welding) Techniques",
                "text": "Gas Metal Arc Welding (GMAW), or MIG, uses a continuous solid wire fed through a gun, shielded by an external gas like 75% Argon / 25% CO2 (C25). MIG is considered a semi-automatic process because the machine controls the wire feed speed (which directly dictates amperage) and voltage (which dictates arc length and bead width). A 'push' technique yields a flatter, wider bead with less penetration, while a 'pull' (drag) technique yields a taller bead with deeper penetration. If the wire feed is too fast, you will experience 'stubbing'; if voltage is too high, it will create excessive spatter and undercut."
            },
            {
                "module_number": 4,
                "title": "GTAW (TIG Welding) and Metallurgy",
                "text": "Gas Tungsten Arc Welding (GTAW), or TIG, uses a non-consumable tungsten electrode and 100% Argon shielding gas. The welder manually feeds a filler rod into the weld pool while controlling heat with a foot pedal. TIG produces the highest quality, surgical-grade welds. For welding aluminum, you must use Alternating Current (AC). The positive half of the AC cycle provides cathodic cleaning, blasting away the aluminum oxide layer (which melts at 3,700 F), while the negative half penetrates the pure aluminum (which melts at 1,220 F). For steel and stainless, use Direct Current Electrode Negative (DCEN)."
            },
            {
                "module_number": 5,
                "title": "Joint Design, Defects, and Inspection",
                "text": "Common joints include butt, fillet, lap, corner, and edge joints. Penetration is the depth the weld metal extends into the root of the joint. Undercut is a critical defect where the base metal is melted away at the toe of the weld without being filled by filler metal, creating a weak stress riser. Porosity (holes in the weld) is caused by atmospheric contamination, usually due to insufficient shielding gas flow or wind. Lack of fusion occurs when the weld metal fails to bond to the base metal, often caused by traveling too fast or using insufficient amperage. Visual inspection and non-destructive testing (NDT) like ultrasonic scanning ensure weld integrity."
            }
        ]
    },
    {
        "trade_domain": "Factory Operator",
        "description": "Industrial machinery operation, Lean Six Sigma principles, and automated production safety.",
        "modules": [
            {
                "module_number": 1,
                "title": "Industrial Safety and LOTO",
                "text": "Safety is the foundational metric of any factory. The most critical protocol is Lockout/Tagout (LOTO). Before performing any maintenance, clearing a jam, or entering a machine's guard perimeter, the operator must disconnect all energy sources (electrical, pneumatic, hydraulic, and kinetic). The energy source must be physically locked with a padlock, and the operator must keep the key. A tag is attached to identify who locked it out. Never attempt to bypass safety light curtains, interlock switches, or physical guards. Bypassing safety devices is a primary cause of industrial amputations and fatalities."
            },
            {
                "module_number": 2,
                "title": "Machine Operation and HMI Interfaces",
                "text": "Modern factories utilize PLC (Programmable Logic Controller) driven automation. Operators interact with these systems via the Human-Machine Interface (HMI) touchscreens. The HMI displays real-time production metrics, fault codes, and sensor statuses. When a machine faults, the operator must read the HMI alarm banner to determine the cause—such as 'Proximity Sensor 4 Fault' or 'VFD Over-Torque'. Operators must understand how to safely perform a homing sequence to reset machine axes to their zero positions after an emergency stop (E-Stop). Always verify the machine is clear of personnel before hitting the reset and start sequence."
            },
            {
                "module_number": 3,
                "title": "Quality Control and Tolerance",
                "text": "Factory operators are the first line of defense for Quality Assurance (QA). Operators use precision measuring instruments like digital calipers, micrometers, and go/no-go gauges to verify parts meet engineering tolerances. A tolerance is the allowable variation in a physical dimension. If a part's diameter must be 50.00mm +/- 0.05mm, any part measuring 49.94mm or 50.06mm is considered scrap. Operators must perform random statistical sampling throughout their shift. If a machine begins producing consecutive out-of-tolerance parts, the operator must halt production immediately to prevent mass scrap and escalate to a maintenance technician."
            },
            {
                "module_number": 4,
                "title": "Lean Manufacturing and 5S",
                "text": "Lean manufacturing aims to eliminate waste (Muda) in production. The core tool for operator efficiency is the 5S system: Sort, Set in order, Shine, Standardize, and Sustain. 'Sort' means removing unnecessary items from the workstation. 'Set in order' means creating a specific, labeled place for every tool (shadow boards). 'Shine' means keeping the machine meticulously clean, which helps in early detection of oil leaks or loose bolts. By sustaining this system, operators eliminate the time wasted searching for tools, reduce trip hazards, and increase overall Equipment Effectiveness (OEE)."
            },
            {
                "module_number": 5,
                "title": "Pneumatic and Hydraulic Fundamentals",
                "text": "Many factory actuators are driven by fluid power. Pneumatic systems use compressed air, typically running at 90-100 PSI, to drive fast, lightweight movements. Operators must ensure air line lubricators have oil and moisture traps are drained, as water in pneumatic lines destroys solenoid valves. Hydraulic systems use pressurized oil, operating at massive pressures (1000-3000 PSI), to deliver immense force for pressing and lifting. Hydraulic leaks are extreme hazards; a pinhole leak of high-pressure hydraulic fluid can inject oil straight through human skin, requiring immediate surgical amputation to prevent toxic gangrene."
            }
        ]
    }
]

print("Starting deep curriculum seeding...")

# Clean existing
print("Clearing old tables...")
supabase.table('course_knowledge_base').delete().neq('module_id', -1).execute()
supabase.table('edtech_modules').delete().neq('course_id', -1).execute()
supabase.table('edtech_courses').delete().neq('id', -1).execute()

# Insert Courses
for course in CURRICULUM:
    print(f"\n--- Inserting Course: {course['trade_domain']} ---")
    c_res = supabase.table('edtech_courses').insert({
        "trade_domain": course["trade_domain"],
        "description": course["description"]
    }).execute()
    course_id = c_res.data[0]['id']

    for module in course["modules"]:
        print(f"  -> Building Module {module['module_number']}: {module['title']}")
        
        # Insert module
        m_res = supabase.table('edtech_modules').insert({
            "course_id": course_id,
            "module_number": module["module_number"],
            "title": module["title"]
        }).execute()
        module_id = m_res.data[0]['id']

        # Embed text
        text_chunk = module["text"]
        vectors = list(embedding_model.embed([text_chunk]))
        vector_list = vectors[0].tolist()

        # Insert to knowledge base
        supabase.table('course_knowledge_base').insert({
            "module_id": module_id,
            "chunk_text": text_chunk,
            "embedding": vector_list
        }).execute()

print("\nSUCCESS! Massive EdTech curriculum has been injected into Supabase!")
