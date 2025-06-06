First API response
data ; {
matches : ['python'], 
gaps : ['javascript']
}


Second API Response
{
            "resume_data": resume_data,
            "job_details": {
                "job_title": job_title,
                "job_description": job_description
            },
            "analysis": analysis_data
        }
analysis_data : {
index : 1, 
suggestion : 'code more'
}


## Edit Resume Flow

1. User clicks text
   ↓
2. Component enters edit mode
   ↓
3. User types changes
   ↓
4. Local state updates
   ↓
5. User presses Enter/clicks away
   ↓
6. onEdit callback fires
   ↓
7. Parent component updates global state
   ↓
8. Component re-renders with new data
   ↓
9. Edit mode exits, showing updated content

## Resume Tailoring Flow

User opens dialog ⟶ pastes JD ⟶ clicks "Analyze Resume"
            ⟶ API returns suggestions
            ⟶ user accepts/rejects changes
            ⟶ clicks "Apply Accepted Changes"
            ⟶ parent component updates the resume

User Click on Tailor Resume Card 
   ↓
Paste Job Description & Select Resume
   ↓
Click Tailor Resume Button 
   ↓
User Redirect to the editor page
   ↓
User can see the changes in the editor page and can accept or reject the changes which comes from the API call
   ↓
New values are saved in the database and parent component updates the resume
   ↓
User Click on Save & Download Button
   ↓
User Redirect to the resume optimizer page


