import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ReactSpeedometer from "react-d3-speedometer"
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useLocation } from 'react-router-dom';


function Feedback() {
    const location = useLocation();
    const { words, feedback } = location.state || {};

    //alert("Feedback component received feedback: " + JSON.stringify(feedback));

    const sampleOutput = `{
        "speech_type": "casual presentation",
        "quick_read": "A casual, friendly history of skateboarding with frequent fillers. The main milestones are clear (origin, 1970s wheel tech, 80s-90s culture, today’s Olympic status), but the delivery is choppy due to filler and hedging. With tighter signposting and shorter sentences, it would feel more confident and engaging.",
        "filler_words": {
            "total_count": 18,
            "breakdown": {
            "um": 4,
            "uh": 5,
            "like": 3,
            "you_know": 0,
            "literally": 1,
            "basically": 1,
            "i_mean": 0,
            "other": 4
            },
            "patterns_noted": "Heavy use of um/uh and like; several occurrences of 'kinda' and phrases like 'I think' that dilute authority; rhythm is interrupted by frequent hesitations."
        },
        "dimensions": {
            "clarity": {
            "score": 6,
            "feedback": "Topic is understandable and mostly chronological, but some sentences are dense and littered with fillers. Shorter sentences and clearer signposts would help."
            },
            "filler_words_and_habits": {
            "score": 4,
            "feedback": "Filler-heavy delivery drags the pace. Aim to reduce um/uh/like to a minimum and replace with brief pauses."
            },
            "confidence_and_tone": {
            "score": 5,
            "feedback": "Hesitation and hedging make it feel tentative. Use definitive statements and confident openings to establish authority."
            },
            "naturalness_and_flow": {
            "score": 5,
            "feedback": "Rhythm is choppy due to fillers; vary sentence length and insert natural pauses to improve flow."
            },
            "getting_the_point_across": {
            "score": 7,
            "feedback": "Core arc is clear and milestones are identifiable; closing wraps up the idea, but could be stronger with a crisp takeaway."
            },
            "engagement": {
            "score": 5,
            "feedback": "Informative but not particularly engaging. Add a vivid detail, quick anecdote, or vivid language to hook the listener early."
            }
        },
        "things_to_try": [
            {
            "priority": 1,
            "suggestion": "Trim filler and practice pauses to replace with breath; start with a clean opening.",
            "example_before": "Uh, okay, so… hi everyone.",
            "example_after": "Hi everyone. Today I’ll share the history of skateboarding."
            },
            {
            "priority": 2,
            "suggestion": "Drop 'um/uh/like' and restructure sentences for directness.",
            "example_before": "So, like, skateboarding actually started in the 1950s in California, when surfers kinda wanted something to do when there weren’t waves.",
            "example_after": "Skateboarding started in the 1950s in California, when surfers wanted something to do without waves."
            },
            {
            "priority": 3,
            "suggestion": "Use signposts and shorter sentences to create rhythm.",
            "example_before": "They called it, uh, “sidewalk surfing,” which I think is kinda funny.",
            "example_after": "They called it 'sidewalk surfing'—a term that shows how new the idea was."
            },
            {
            "priority": 4,
            "suggestion": "Shorten sentences and replace 'literally'/'kinda' with precise words.",
            "example_before": "At first, the boards were super basic, like, literally just wooden planks with roller skate wheels attached.",
            "example_after": "At first, boards were basic: wooden planks with roller skate wheels."
            },
            {
            "priority": 5,
            "suggestion": "Close with a crisp takeaway or call to action.",
            "example_before": "Um, yeah, so overall, it went from, like, a small hobby to something global.",
            "example_after": "In short, skateboarding grew from a local hobby to a global sport."
            }
        ]
    }`;

    const sampleWords = `[
    { "text": "Hello", "start": 1861, "end": 2696, "confidence": 0.9552518, "speaker": null },
    { "text": "and", "start": 3787, "end": 4044, "confidence": 0.78935915, "speaker": null },
    { "text": "good", "start": 4044, "end": 4237, "confidence": 0.9990089, "speaker": null },
    { "text": "afternoon,", "start": 4269, "end": 4574, "confidence": 0.7728405, "speaker": null },
    { "text": "everyone.", "start": 4670, "end": 4959, "confidence": 0.99021906, "speaker": null },
    { "text": "My", "start": 5007, "end": 5168, "confidence": 0.9992975, "speaker": null },
    { "text": "name", "start": 5168, "end": 5328, "confidence": 0.999967, "speaker": null },
    { "text": "is", "start": 5328, "end": 5425, "confidence": 0.9995283, "speaker": null },
    { "text": "Ray.", "start": 5489, "end": 5730, "confidence": 0.79355764, "speaker": null },
    { "text": "For", "start": 7271, "end": 7495, "confidence": 0.9482283, "speaker": null },
    { "text": "our", "start": 7495, "end": 7656, "confidence": 0.9995247, "speaker": null },
    { "text": "project", "start": 7656, "end": 8218, "confidence": 0.999537, "speaker": null },
    { "text": "in", "start": 8218, "end": 8266, "confidence": 0.9480061, "speaker": null },
    { "text": "EDD,", "start": 8603, "end": 8635, "confidence": 0.9580823, "speaker": null },
    { "text": "we", "start": 8699, "end": 9020, "confidence": 0.9968208, "speaker": null },
    { "text": "will", "start": 9405, "end": 9614, "confidence": 0.9711906, "speaker": null },
    { "text": "be", "start": 9646, "end": 9903, "confidence": 0.9993325, "speaker": null },
    { "text": "creating", "start": 9967, "end": 10754, "confidence": 0.99060446, "speaker": null },
    { "text": "a", "start": 11010, "end": 11042, "confidence": 0.9989661, "speaker": null },
    { "text": "voice", "start": 11042, "end": 11347, "confidence": 0.9996165, "speaker": null },
    { "text": "recorder", "start": 11347, "end": 11701, "confidence": 0.999944, "speaker": null },
    { "text": "that", "start": 12375, "end": 12535, "confidence": 0.9989549, "speaker": null },
    { "text": "essentially", "start": 12535, "end": 13081, "confidence": 0.9994388, "speaker": null },
    { "text": "takes", "start": 13177, "end": 13498, "confidence": 0.9999341, "speaker": null },
    { "text": "input", "start": 13514, "end": 13819, "confidence": 0.99956316, "speaker": null },
    { "text": "from", "start": 13819, "end": 13932, "confidence": 0.9998547, "speaker": null },
    { "text": "our", "start": 13932, "end": 14028, "confidence": 0.9994678, "speaker": null },
    { "text": "device", "start": 14076, "end": 14574, "confidence": 0.99847597, "speaker": null },
    { "text": "and", "start": 15264, "end": 15344, "confidence": 0.9969234, "speaker": null },
    { "text": "sends", "start": 15376, "end": 15681, "confidence": 0.99406636, "speaker": null },
    { "text": "it", "start": 15681, "end": 15777, "confidence": 0.9994012, "speaker": null },
    { "text": "to", "start": 15777, "end": 15858, "confidence": 0.9997557, "speaker": null },
    { "text": "the", "start": 15858, "end": 16066, "confidence": 0.995125, "speaker": null },
    { "text": "cloud", "start": 16066, "end": 16420, "confidence": 0.9953317, "speaker": null },
    { "text": "where", "start": 17029, "end": 17142, "confidence": 0.5592867, "speaker": null },
    { "text": "we", "start": 17270, "end": 17367, "confidence": 0.99975497, "speaker": null },
    { "text": "then", "start": 17367, "end": 17495, "confidence": 0.9937738, "speaker": null },
    { "text": "analyze", "start": 17671, "end": 18137, "confidence": 0.99933016, "speaker": null },
    { "text": "your", "start": 18875, "end": 19004, "confidence": 0.9982114, "speaker": null },
    { "text": "voice", "start": 19453, "end": 19806, "confidence": 0.9998797, "speaker": null },
    { "text": "to", "start": 19935, "end": 20095, "confidence": 0.9992099, "speaker": null },
    { "text": "detect", "start": 20095, "end": 20561, "confidence": 0.99993634, "speaker": null },
    { "text": "any", "start": 20577, "end": 20753, "confidence": 0.9997379, "speaker": null },
    { "text": "filler", "start": 20753, "end": 21122, "confidence": 0.99903166, "speaker": null },
    { "text": "words,", "start": 21122, "end": 21347, "confidence": 0.9803604, "speaker": null },
    { "text": "your", "start": 21925, "end": 22021, "confidence": 0.9978399, "speaker": null },
    { "text": "speech", "start": 22021, "end": 22246, "confidence": 0.93663836, "speaker": null },
    { "text": "patterns,", "start": 22262, "end": 22792, "confidence": 0.993436, "speaker": null },
    { "text": "how", "start": 23289, "end": 23321, "confidence": 0.98915875, "speaker": null },
    { "text": "fast", "start": 23386, "end": 23594, "confidence": 0.9997397, "speaker": null },
    { "text": "you", "start": 23691, "end": 23787, "confidence": 0.99963284, "speaker": null },
    { "text": "talk,", "start": 23787, "end": 24188, "confidence": 0.9301416, "speaker": null },
    { "text": "all", "start": 24573, "end": 24638, "confidence": 0.99485296, "speaker": null },
    { "text": "of", "start": 24686, "end": 24734, "confidence": 0.9146507, "speaker": null },
    { "text": "that.", "start": 24750, "end": 24975, "confidence": 0.9300782, "speaker": null },
    { "text": "And", "start": 25151, "end": 25215, "confidence": 0.99191576, "speaker": null },
    { "text": "we", "start": 25247, "end": 25392, "confidence": 0.99975556, "speaker": null },
    { "text": "use", "start": 25392, "end": 25569, "confidence": 0.9957766, "speaker": null },
    { "text": "our", "start": 25569, "end": 25761, "confidence": 0.99871254, "speaker": null },
    { "text": "AI", "start": 25857, "end": 25954, "confidence": 0.930347, "speaker": null },
    { "text": "models,", "start": 25954, "end": 26323, "confidence": 0.9569915, "speaker": null },
    { "text": "our", "start": 26435, "end": 26596, "confidence": 0.9307441, "speaker": null },
    { "text": "specially", "start": 26596, "end": 27045, "confidence": 0.9786477, "speaker": null },
    { "text": "trained", "start": 27077, "end": 27318, "confidence": 0.99736303, "speaker": null },
    { "text": "AI", "start": 27382, "end": 27479, "confidence": 0.76798177, "speaker": null },
    { "text": "models,", "start": 27479, "end": 27767, "confidence": 0.48430303, "speaker": null },
    { "text": "to", "start": 27864, "end": 28105, "confidence": 0.91112214, "speaker": null },
    { "text": "give", "start": 28522, "end": 28747, "confidence": 0.80250806, "speaker": null },
    { "text": "you", "start": 28747, "end": 28795, "confidence": 0.9986909, "speaker": null },
    { "text": "a", "start": 29068, "end": 29116, "confidence": 0.9988174, "speaker": null },
    { "text": "score", "start": 29887, "end": 30224, "confidence": 0.9960192, "speaker": null },
    { "text": "of", "start": 30449, "end": 30529, "confidence": 0.99796945, "speaker": null },
    { "text": "how", "start": 30529, "end": 30641, "confidence": 0.9995216, "speaker": null },
    { "text": "well", "start": 30754, "end": 31011, "confidence": 0.9993667, "speaker": null },
    { "text": "you", "start": 31011, "end": 31123, "confidence": 0.9994449, "speaker": null },
    { "text": "presented", "start": 31171, "end": 31830, "confidence": 0.98467225, "speaker": null },
    { "text": "or", "start": 31894, "end": 31942, "confidence": 0.86483365, "speaker": null },
    { "text": "how", "start": 32038, "end": 32135, "confidence": 0.9976655, "speaker": null },
    { "text": "well", "start": 32199, "end": 32440, "confidence": 0.9987301, "speaker": null },
    { "text": "you", "start": 32440, "end": 32536, "confidence": 0.9995745, "speaker": null },
    { "text": "talk", "start": 32536, "end": 32761, "confidence": 0.97197616, "speaker": null },
    { "text": "on", "start": 32857, "end": 33002, "confidence": 0.99843377, "speaker": null },
    { "text": "a", "start": 33002, "end": 33082, "confidence": 0.99918, "speaker": null },
    { "text": "day-to-day", "start": 33082, "end": 33499, "confidence": 0.988467, "speaker": null },
    { "text": "basis.", "start": 33499, "end": 33933, "confidence": 0.9965758, "speaker": null },
    { "text": "Our", "start": 35988, "end": 36069, "confidence": 0.90227115, "speaker": null },
    { "text": "product", "start": 36069, "end": 36647, "confidence": 0.99819726, "speaker": null },
    { "text": "is", "start": 36775, "end": 36839, "confidence": 0.99906427, "speaker": null },
    { "text": "extremely", "start": 36952, "end": 37433, "confidence": 0.99985325, "speaker": null },
    { "text": "versatile,", "start": 37433, "end": 38027, "confidence": 0.9595266, "speaker": null },
    { "text": "meaning", "start": 38236, "end": 38525, "confidence": 0.9985066, "speaker": null },
    { "text": "you", "start": 38622, "end": 38718, "confidence": 0.9955395, "speaker": null },
    { "text": "can", "start": 38718, "end": 38927, "confidence": 0.99973696, "speaker": null },
    { "text": "deploy", "start": 39119, "end": 39473, "confidence": 0.9990319, "speaker": null },
    { "text": "it", "start": 39521, "end": 39633, "confidence": 0.6911011, "speaker": null },
    { "text": "at", "start": 39745, "end": 39826, "confidence": 0.9541097, "speaker": null },
    { "text": "any", "start": 39826, "end": 40002, "confidence": 0.98489827, "speaker": null },
    { "text": "time.", "start": 40002, "end": 40307, "confidence": 0.931546, "speaker": null },
    { "text": "The", "start": 40869, "end": 40918, "confidence": 0.9965952, "speaker": null },
    { "text": "device", "start": 40966, "end": 41351, "confidence": 0.99992895, "speaker": null },
    { "text": "fits", "start": 41351, "end": 41528, "confidence": 0.9996567, "speaker": null },
    { "text": "in", "start": 41528, "end": 41576, "confidence": 0.99953353, "speaker": null },
    { "text": "your", "start": 41608, "end": 41753, "confidence": 0.9999038, "speaker": null },
    { "text": "pocket,", "start": 41753, "end": 42218, "confidence": 0.63844883, "speaker": null },
    { "text": "and", "start": 42636, "end": 42909, "confidence": 0.99975115, "speaker": null },
    { "text": "our", "start": 42973, "end": 43053, "confidence": 0.9983468, "speaker": null },
    { "text": "device", "start": 43053, "end": 43455, "confidence": 0.9996314, "speaker": null },
    { "text": "boasts", "start": 43455, "end": 44017, "confidence": 0.97351134, "speaker": null },
    { "text": "32GB", "start": 44017, "end": 44579, "confidence": 0.47966543, "speaker": null },
    { "text": "of", "start": 44739, "end": 44868, "confidence": 0.9964043, "speaker": null },
    { "text": "memory,", "start": 44884, "end": 45189, "confidence": 0.95566225, "speaker": null },
    { "text": "allowing", "start": 45365, "end": 45590, "confidence": 0.99990296, "speaker": null },
    { "text": "you", "start": 45686, "end": 45783, "confidence": 0.99983466, "speaker": null },
    { "text": "to", "start": 45783, "end": 45943, "confidence": 0.99980515, "speaker": null },
    { "text": "talk", "start": 45943, "end": 46200, "confidence": 0.9998809, "speaker": null },
    { "text": "for", "start": 46200, "end": 46425, "confidence": 0.9988053, "speaker": null },
    { "text": "many,", "start": 46425, "end": 46666, "confidence": 0.9666657, "speaker": null },
    { "text": "many", "start": 46682, "end": 46923, "confidence": 0.9999937, "speaker": null },
    { "text": "hours", "start": 47051, "end": 47276, "confidence": 0.99988806, "speaker": null },
    { "text": "without", "start": 47308, "end": 47629, "confidence": 0.9996543, "speaker": null },
    { "text": "ever", "start": 47629, "end": 47902, "confidence": 0.9041939, "speaker": null },
    { "text": "worrying", "start": 48255, "end": 48480, "confidence": 0.9995701, "speaker": null },
    { "text": "about", "start": 48593, "end": 48866, "confidence": 0.999846, "speaker": null },
    { "text": "the", "start": 48994, "end": 49090, "confidence": 0.99827397, "speaker": null },
    { "text": "battery", "start": 49090, "end": 49444, "confidence": 0.9995278, "speaker": null },
    { "text": "or", "start": 49861, "end": 49893, "confidence": 0.9991385, "speaker": null },
    { "text": "storage", "start": 49893, "end": 50246, "confidence": 0.99965227, "speaker": null },
    { "text": "running", "start": 50423, "end": 50632, "confidence": 0.99741346, "speaker": null },
    { "text": "out.", "start": 50680, "end": 50776, "confidence": 0.9973393, "speaker": null },
    { "text": "In", "start": 52446, "end": 52543, "confidence": 0.990024, "speaker": null },
    { "text": "addition,", "start": 52543, "end": 52976, "confidence": 0.80334496, "speaker": null },
    { "text": "The", "start": 54775, "end": 54855, "confidence": 0.9856306, "speaker": null },
    { "text": "chassis", "start": 54855, "end": 55240, "confidence": 0.9835186, "speaker": null },
    { "text": "is", "start": 55337, "end": 55417, "confidence": 0.99154717, "speaker": null },
    { "text": "made", "start": 55481, "end": 55642, "confidence": 0.9970867, "speaker": null },
    { "text": "of", "start": 55658, "end": 55787, "confidence": 0.9562079, "speaker": null },
    { "text": "PLA", "start": 55803, "end": 56220, "confidence": 0.92192686, "speaker": null },
    { "text": "3D", "start": 56445, "end": 57023, "confidence": 0.99927986, "speaker": null },
    { "text": "printed", "start": 57023, "end": 57312, "confidence": 0.4941473, "speaker": null },
    { "text": "material,", "start": 57344, "end": 57794, "confidence": 0.84253854, "speaker": null },
    { "text": "providing", "start": 58131, "end": 58517, "confidence": 0.99920005, "speaker": null },
    { "text": "an", "start": 58549, "end": 58597, "confidence": 0.9146581, "speaker": null }
]`;

    const sampleWords_json = JSON.parse(sampleWords)

    let json_output = null;
    if (feedback) {
      // Try parsed first (most reliable)
      if (feedback.parsed) {
        json_output = feedback.parsed;
      } 
      // Try raw text (might be JSON string)
      else if (feedback.raw && typeof feedback.raw === 'string' && feedback.raw !== 'No feedback returned') {
        try {
          json_output = JSON.parse(feedback.raw);
        } catch (err) {
          console.warn('Could not parse feedback.raw', err);
        }
      } 
      // Try OpenAI nested structure
      else if (feedback.openai?.output?.[1]?.content?.[0]?.text) {
        try {
          json_output = JSON.parse(feedback.openai.output[1].content[0].text);
        } catch (err) {
          console.warn('Could not parse nested OpenAI response', err);
        }
      }
      // Try OpenAI output[0] as fallback
      else if (feedback.openai?.output?.[0]?.content?.[0]?.text) {
        try {
          json_output = JSON.parse(feedback.openai.output[0].content[0].text);
        } catch (err) {
          console.warn('Could not parse OpenAI output[0]', err);
        }
      }
      // Finally, if feedback is a string, try parsing it
      else if (typeof feedback === 'string') {
        try {
          json_output = JSON.parse(feedback);
        } catch (err) {
          console.warn('Could not parse feedback string', err);
        }
      }
    }

    if (!json_output) {
      try {
        json_output = JSON.parse(sampleOutput);
      } catch (err) {
        console.error('Could not parse sample output JSON', err);
        json_output = {};
      }
    }

    const wordsArray = Array.isArray(words)
    ? words
    : typeof words === 'string'
        ? (() => {
            try { return JSON.parse(words); } catch { return sampleWords_json; }
        })()
        : sampleWords_json;

    const confidence_num = wordsArray.length
      ? (wordsArray.reduce((sum, w) => sum + (w.confidence || 0), 0) / wordsArray.length).toFixed(3)
      : 0;

    const confidence_aggregate = Math.round(Number(confidence_num) * 100) / 100;
    
    const words_per_minute = wordsArray.length > 1
      ? (wordsArray.length / ((wordsArray[wordsArray.length - 1].end - wordsArray[0].start) / 60000)).toFixed(1)
      : 0;


    const breakdown = json_output?.filler_words?.breakdown || {};
    const filler_total = json_output?.filler_words?.total_count ?? 0;

    const totalWords = wordsArray.length;
    const fillerRatio = totalWords > 0 ? (filler_total / totalWords) : 0;
    const fillerRatioPercent = (fillerRatio * 100).toFixed(1);

    const top2 = Object.entries(breakdown)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([word]) => word)
    .join(', ') || 'None';


    const dimensionNames = {
        clarity: 'Clarity',
        filler_words_and_habits: 'Filler Words & Habits',
        confidence_and_tone: 'Confidence & Tone',
        naturalness_and_flow: 'Naturalness & Flow',
        getting_the_point_across: 'Getting the Point Across',
        engagement: 'Engagement'
    };

    const intervalMs = 10000; // 10-second intervals
    const startTime = wordsArray[0]?.start ?? 0;
    const endTime = wordsArray[wordsArray.length - 1]?.end ?? 0;

    const intervals = [];
    for (let t = startTime; t < endTime; t += intervalMs) {
    const intervalStart = t;
    const intervalEnd = Math.min(t + intervalMs, endTime); // handle last shorter interval

    const count = wordsArray.filter(
        word => word.start >= intervalStart && word.start < intervalEnd
    ).length;

    const durationMinutes = (intervalEnd - intervalStart) / 60000; // actual duration in minutes
    const wpm = durationMinutes > 0 ? count / durationMinutes : 0;

    intervals.push({
        time: (intervalStart - startTime) / 1000, // seconds from start
        wpm
    });
    }

    return(
        <div style={{ margin: '-30px', padding: '10px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            <div style={{ width: '100%', maxWidth: '600px' }}>
                {/* Header */}
                <h1 style={{color: "#333", marginBottom: '10px', textAlign: 'center'}}>{json_output?.speech_type || 'Speech Analysis'}</h1>
                
                {/* Quick Read */}
                <div style={{
                    backgroundColor: '#e8f4f8',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '30px',
                    borderLeft: '4px solid #17a2b8'
                }}>
                    <p style={{color: '#333', lineHeight: '1.6', fontSize: '16px', textAlign: 'center'}}>
                        {json_output?.quick_read || 'No quick read available.'}
                    </p>
                </div>

                {/* Metrics Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginBottom: '40px', alignItems: 'center' }}>
                    {/* Word Pronunciation */}
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <h4 style={{color: '#333', marginBottom: '15px'}}>Word Pronunciation</h4>
                        <div style={{ width: '120px', margin: '0 auto' }}>
                            <CircularProgressbar
                                value={confidence_aggregate * 100}
                                text={`${confidence_aggregate * 100}%`}
                                styles={{
                                    path: { stroke: '#17a2b8' },
                                    text: { fill: '#333', fontSize: '18px', fontWeight: 'bold' }
                                }}
                            />
                        </div>
                    </div>

                    {/* Words Per Minute */}
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <h4 style={{color: '#333'}}>Words Per Minute (WPM)</h4>
                        <ReactSpeedometer 
                            ringWidth={50}
                            height={200}
                            width={250}
                            maxValue={290}
                            value={Math.min(words_per_minute, 290)}
                            needleColor="black"
                            startColor="green"
                            segments={3}
                            endColor="blue"
                            customSegmentStops = {[0, 130, 160, 290]}
                            segmentColors={['#e0e0e0', '#66cc66', '#e0e0e0']}
                        />
                    </div>
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <h4 style={{color: '#333'}}>Over Time</h4>
                        <LineChart width={300} height={200} data={intervals} margin={{bottom:30}}>
                        <XAxis dataKey="time" label={{ value: "Time (s)", position: "bottom", offset: 0 }}
                            tick={{ dy: 5 }} />                           
                        <YAxis label={{ value: "WPM", angle: -90, position: "insideLeft" }}/>
                        <Line type="monotone" dataKey="wpm" stroke="#28a745" strokeWidth={2}/>
                        </LineChart>
                    </div>


                    {/* Filler Words */}
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <h4 style={{color: '#333'}}>Filler Words</h4>
                        <p style={{fontSize: '32px', fontWeight: 'bold', color: '#dc3545', margin: '5px 0'}}>
                            {filler_total} <br/>
                            <span style={{ fontSize: '14px', color: 'gray' }}> ({fillerRatioPercent}% of words) </span>
                        </p>
                        <p style={{color: '#666', fontSize: '14px'}}>Most used: {top2}</p>
                    </div>
                </div>

                {/* Dimensions Grid */}
                <h2 style={{color: '#333', marginBottom: '20px', marginTop: '40px', textAlign: 'center'}}>Dimensions</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    {json_output?.dimensions && Object.entries(json_output.dimensions).map(([key, dimension]) => {
                        const displayName = dimensionNames[key] || key;
                        const score = dimension?.score || 0;
                        const feedback_text = dimension?.feedback || '';
                        
                        return (
                            <div key={key} style={{
                                backgroundColor: '#fff',
                                padding: '20px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                border: '1px solid #e0e0e0',
                                textAlign: 'center'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px' }}>
                                    <h4 style={{color: '#333', margin: '0 0 15px 0'}}>{displayName}</h4>
                                    <div style={{
                                        width: '80px',
                                        height: '80px'
                                    }}>
                                        <CircularProgressbar
                                            value={score * 10}
                                            text={`${score}/10`}
                                            styles={{
                                                path: { stroke: score >= 7 ? '#28a745' : score >= 5 ? '#ffc107' : '#dc3545' },
                                                text: { fill: '#333', fontSize: '14px', fontWeight: 'bold' }
                                            }}
                                        />
                                    </div>
                                </div>
                                <p style={{color: '#666', fontSize: '14px', lineHeight: '1.5', margin: '0'}}>
                                    {feedback_text}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Things to Try */}
                <h2 style={{color: '#333', marginBottom: '20px', marginTop: '40px', textAlign: 'center'}}>Tips to Improve</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    {json_output?.things_to_try && json_output.things_to_try.map((item, index) => (
                        <div key={index} style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            borderLeft: `4px solid ${item.priority <= 2 ? '#dc3545' : item.priority <= 4 ? '#ffc107' : '#17a2b8'}`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                                <div style={{
                                    backgroundColor: item.priority <= 2 ? '#dc3545' : item.priority <= 4 ? '#ffc107' : '#17a2b8',
                                    color: '#fff',
                                    width: '35px',
                                    height: '35px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    flexShrink: 0
                                }}>
                                    {item.priority}
                                </div>
                                <div style={{flex: 1, textAlign: 'center'}}>
                                    <h4 style={{color: '#333', margin: '0 0 10px 0'}}>{item.suggestion}</h4>
                                    {item.example_before && (
                                        <div style={{
                                            backgroundColor: '#f5f5f5',
                                            padding: '10px',
                                            borderRadius: '4px',
                                            marginBottom: '10px',
                                            borderLeft: '3px solid #dc3545'
                                        }}>
                                            <strong style={{color: '#666'}}>Before:</strong>
                                            <p style={{color: '#666', margin: '5px 0 0 0', fontSize: '14px', fontStyle: 'italic'}}>
                                                "{item.example_before}"
                                            </p>
                                        </div>
                                    )}
                                    {item.example_after && (
                                        <div style={{
                                            backgroundColor: '#f0f8f0',
                                            padding: '10px',
                                            borderRadius: '4px',
                                            borderLeft: '3px solid #28a745'
                                        }}>
                                            <strong style={{color: '#666'}}>After:</strong>
                                            <p style={{color: '#666', margin: '5px 0 0 0', fontSize: '14px', fontStyle: 'italic'}}>
                                                "{item.example_after}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 

export default Feedback;