import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { useLocation } from 'react-router-dom';


function Feedback() {
    const location = useLocation();
    const { words, json } = location.state || {};

    alert(words);
    alert(json);

    const sampleOutput=`{
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
        }`

    // const json_output = JSON.parse(sampleOutput) 
    
    // new one
    const json_output = JSON.parse(json);

    // const sampleWords = '[{"text":"Hello,","start":1250,"end":1595,"confidence":0.88662237,"speaker":null},{"text":"my","start":1612,"end":1842,"confidence":0.9996879,"speaker":null},{"text":"name","start":1842,"end":2039,"confidence":0.99981135,"speaker":null},{"text":"is","start":2089,"end":2220,"confidence":0.99952495,"speaker":null},{"text":"Rantaro.","start":2253,"end":2829,"confidence":0.36771432,"speaker":null}]'
    
    //new one
    const sampleWords = words;
    const json_sampleWords = JSON.parse(sampleWords)

    const confidence_aggregate = (json_sampleWords.reduce((sum, w) => sum + w.confidence, 0) / json_sampleWords.length).toFixed(3);
    const words_per_minute = (json_sampleWords.length / ((json_sampleWords[json_sampleWords.length - 1].end - json_sampleWords[0].start) / 60000)).toFixed(1);

    const score = 8

    const breakdown = json_output.filler_words.breakdown;

    const top2 = Object.entries(breakdown).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([word]) => word).join(', ')
    
    // const blockMs = 10000;
    // const totalDuration = json_sampleWords[json_sampleWords.length - 1].end;
    // const blocks = [];

    // for (let t = 0; t < totalDuration; t += blockMs) {
    //     const chunk = json_sampleWords.filter(w => w.start >= t && w.start < t + blockMs);
    //     if (chunk.length > 0) {
    //         const wpm = chunk.length / (blockMs / 60000);
    //         blocks.push(wpm);
    //     }
    // }

    // const mean = blocks.reduce((sum, v) => sum + v, 0) / blocks.length;
    // const stdDev = Math.sqrt(blocks.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / blocks.length);

    // const consistency_score = Math.max(0, (10 - (stdDev / 6))).toFixed(1);


    return(
        <>
            <h1 style={{color:"black"}}>{json_output.speech_type}</h1>

            <div style={{ width: 100 , display: "flex", flexDirection: 'row', gap: 50}}>
            <div>
                <h3>Word pronounciation:</h3>
                <CircularProgressbar
                    value={confidence_aggregate * 100}
                    text={`${confidence_aggregate * 100}%`}
                />
            </div>
            <h3>Words per minute: {words_per_minute}</h3>
            </div>
            <div>
                <h3>filler word count: {json_output.filler_words.total_count}<br/>most used: {top2}</h3>
            </div>
            
        </>
    );
} 

export default Feedback;