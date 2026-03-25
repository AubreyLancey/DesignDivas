import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

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
          try {
            return JSON.parse(words);
          } catch (err) {
            return [];
          }
        })()
      : [];

    const confidence_num = wordsArray.length
      ? (wordsArray.reduce((sum, w) => sum + (w.confidence || 0), 0) / wordsArray.length).toFixed(3)
      : 0;

    const confidence_aggregate = Math.round(Number(confidence_num) * 100) / 100;
    
    const words_per_minute = wordsArray.length > 1
      ? (wordsArray.length / ((wordsArray[wordsArray.length - 1].end - wordsArray[0].start) / 60000)).toFixed(1)
      : 0;


    const breakdown = json_output?.filler_words?.breakdown || {};
    const filler_total = json_output?.filler_words?.total_count ?? 0;

    const top2 = Object.entries(breakdown).length
      ? Object.entries(breakdown).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([word]) => word).join(', ')
      : 'none';


    const dimensionNames = {
        clarity: 'Clarity',
        filler_words_and_habits: 'Filler Words & Habits',
        confidence_and_tone: 'Confidence & Tone',
        naturalness_and_flow: 'Naturalness & Flow',
        getting_the_point_across: 'Getting the Point Across',
        engagement: 'Engagement'
    };

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
                        <h4 style={{color: '#333'}}>Words Per Minute (Ideal is 130-160)</h4>
                        <p style={{fontSize: '36px', fontWeight: 'bold', color: '#17a2b8', margin: '10px 0'}}>
                            {words_per_minute}
                        </p>
                    </div>

                    {/* Filler Words */}
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <h4 style={{color: '#333'}}>Filler Words</h4>
                        <p style={{fontSize: '32px', fontWeight: 'bold', color: '#dc3545', margin: '5px 0'}}>
                            {filler_total}
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