import React, { useState } from "react";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import { Activity, Score } from "../../models/models";

export const ActivityComponent = ({ activity }: { activity: Activity }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  console.log(activity);

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(Number(event.target.value));
    setExplanation(null);
  };

  // Handles the form submission
  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      const selected = [
        activity.answer1,
        activity.answer2,
        activity.answer3,
        activity.answer4,
      ].find((answer) => answer.answer_id === selectedAnswer);

      if (selected) {
        setExplanation("" + selected.answer_explaination);
        setSubmitted(true);

        // Score calculation (1 point for correct, 0 for incorrect)
        // const userScore: Score = {
        //   user_id: { user_id: "", name: "John Doe" }, // Example user
        //   timestamp: new Date(),
        //   score: selected.correct ? 1 : 0,
        // };
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6">{activity.question}</Typography>
      <RadioGroup value={selectedAnswer} onChange={handleAnswerChange}>
        <FormControlLabel
          value={activity.answer1.answer_id}
          control={<Radio />}
          label={activity.answer1.answer_text}
        />
        <FormControlLabel
          value={activity.answer2.answer_id}
          control={<Radio />}
          label={activity.answer2.answer_text}
        />
        <FormControlLabel
          value={activity.answer3.answer_id}
          control={<Radio />}
          label={activity.answer3.answer_text}
        />
        <FormControlLabel
          value={activity.answer4.answer_id}
          control={<Radio />}
          label={activity.answer4.answer_text}
        />
      </RadioGroup>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={submitted}
      >
        Submit
      </Button>

      {submitted && explanation && (
        <Box mt={2}>
          <Typography variant="body1">Explanation: {explanation}</Typography>
        </Box>
      )}
    </Box>
  );
};
