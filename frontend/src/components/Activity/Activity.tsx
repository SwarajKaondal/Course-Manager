import React, { useState } from "react";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import { Activity } from "../../models/models";
import { useAuth } from "../../provider/AuthProvider";
import { PostRequest } from "../../utils/ApiManager";

export const ActivityComponent = ({ activity }: { activity: Activity }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const auth = useAuth();

  const saveScore = async (score: number) => {
    const response = await PostRequest("/student/save_score", {
      role: auth.user?.role,
      user_id: auth.user?.user_id,
      activity_id: activity.activity_id,
      score: score,
    });
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(Number(event.target.value));
    const answer = [
      activity.answer1,
      activity.answer2,
      activity.answer3,
      activity.answer4,
    ].find((answer) => answer.answer_id === Number(event.target.value));

    if (answer !== undefined) {
      setExplanation("" + answer.answer_explanation);
    }

    let score = 1;
    if (answer?.correct == 1) {
      score = 3;
    }
    saveScore(score);
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

      {explanation && (
        <Box mt={2}>
          <Typography variant="body1">Explanation: {explanation}</Typography>
        </Box>
      )}
    </Box>
  );
};
