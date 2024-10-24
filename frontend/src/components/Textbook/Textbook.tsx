import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import { Textbook } from "../../models/models";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ActivityComponent } from "../Activity/Activity";
import { PostRequest } from "../../utils/ApiManager";
import { useAuth } from "../../provider/AuthProvider";

export const TextbookComponent = ({
  textbook,
  refreshTextbooks,
  viewOnly,
}: {
  textbook: Textbook;
  refreshTextbooks: () => void;
  viewOnly: Boolean;
}) => {
  const auth = useAuth();

  const handleAddChapter = async (title: String, chapter_number: number) => {
    const response = await PostRequest("/admin/add_chapter", {
      role: auth.user?.role,
      title: title,
      chapter_number: chapter_number,
      textbook_id: textbook.textbook_id,
    });
    if (response.ok) {
      refreshTextbooks();
    }
  };

  const handleAddSection = async (
    title: String,
    section_number: number,
    chapter_id: number
  ) => {
    const response = await PostRequest("/admin/add_section", {
      role: auth.user?.role,
      title: title,
      section_number: section_number,
      chapter_id: chapter_id,
    });
    if (response.ok) {
      refreshTextbooks();
    }
  };

  const handleAddContent = async (
    sequence_number: number,
    section_id: number
  ) => {
    const response = await PostRequest("/admin/add_content_block", {
      role: auth.user?.role,
      user_id: auth.user?.user_id,
      sequence_number: sequence_number,
      section_id: section_id,
    });
    if (response.ok) {
      refreshTextbooks();
    }
  };

  const handleAddTextBlock = async (text: String, content_block_id: number) => {
    const response = await PostRequest("/admin/add_text", {
      role: auth.user?.role,
      text: text,
      content_block_id: content_block_id,
    });
    if (response.ok) {
      console.log("Cool");
      refreshTextbooks();
    }
  };

  const handleAddImage = async (img_path: String, content_block_id: number) => {
    const response = await PostRequest("/admin/add_picture", {
      role: auth.user?.role,
      img_path: img_path,
      content_block_id: content_block_id,
    });
    if (response.ok) {
      refreshTextbooks();
    }
  };

  const handleAddActivity = async (
    question: String,
    content_blk_id: number,
    ans_txt_1: String,
    ans_explain_1: String,
    correct_1: Boolean,
    ans_txt_2: String,
    ans_explain_2: String,
    correct_2: Boolean,
    ans_txt_3: String,
    ans_explain_3: String,
    correct_3: Boolean,
    ans_txt_4: String,
    ans_explain_4: String,
    correct_4: Boolean
  ) => {
    const response = await PostRequest("/admin/add_activity", {
      role: auth.user?.role,
      question,
      content_blk_id,
      ans_txt_1,
      ans_explain_1,
      correct_1,
      ans_txt_2,
      ans_explain_2,
      correct_2,
      ans_txt_3,
      ans_explain_3,
      correct_3,
      ans_txt_4,
      ans_explain_4,
      correct_4,
    });
    if (response.ok) {
      refreshTextbooks();
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h3" gutterBottom>
          {textbook.title}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          color="primary"
          onClick={() => handleAddChapter()}
          sx={{ display: viewOnly ? "none" : "" }}
        >
          Add Chapter
        </Button>
      </Box>
      <Divider />
      {textbook.chapters &&
        textbook.chapters.length > 0 &&
        textbook.chapters.map((chapter, chapter_idx) => (
          <Accordion
            key={"chapter-" + chapter_idx}
            defaultExpanded
            sx={{ boxShadow: "none", border: "none" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h4">
                {chapter.chapter_number} {chapter.title}
              </Typography>
              <Box sx={{ ml: "auto" }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  color="primary"
                  onClick={handleAddSection}
                  sx={{ display: viewOnly ? "none" : "" }}
                >
                  Add Section
                </Button>
              </Box>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              {chapter.sections &&
                chapter.sections.length > 0 &&
                chapter.sections.map((section, section_idx) => (
                  <Accordion
                    key={"section-" + section_idx}
                    defaultExpanded
                    sx={{ boxShadow: "none", border: "none" }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h5">
                        {chapter.chapter_number}.{section.section_number}{" "}
                        {section.title}
                      </Typography>
                      <Box sx={{ ml: "auto" }}>
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          color="primary"
                          onClick={handleAddContent}
                          sx={{ display: viewOnly ? "none" : "" }}
                        >
                          Add Content
                        </Button>
                      </Box>
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails>
                      {section.content_blocks &&
                        section.content_blocks.length > 0 &&
                        section.content_blocks.map((content, content_idx) => (
                          <Accordion
                            key={"content-" + content_idx}
                            defaultExpanded
                            sx={{ boxShadow: "none", border: "none" }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="h6">
                                {chapter.chapter_number}.
                                {section.section_number}.
                                {content.sequence_number}
                              </Typography>
                              <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                                <Button
                                  variant="outlined"
                                  startIcon={<AddIcon />}
                                  color="primary"
                                  onClick={handleAddTextBlock}
                                  sx={{
                                    display:
                                      content.text_block !== undefined ||
                                      viewOnly
                                        ? "none"
                                        : "",
                                  }}
                                >
                                  Add Text
                                </Button>
                                <Button
                                  variant="outlined"
                                  startIcon={<AddIcon />}
                                  color="primary"
                                  onClick={handleAddImage}
                                  sx={{
                                    display:
                                      content.image !== undefined || viewOnly
                                        ? "none"
                                        : "",
                                  }}
                                >
                                  Add Image
                                </Button>
                                <Button
                                  variant="outlined"
                                  startIcon={<AddIcon />}
                                  color="primary"
                                  onClick={handleAddActivity}
                                  sx={{
                                    display:
                                      content.activity !== undefined || viewOnly
                                        ? "none"
                                        : "",
                                  }}
                                >
                                  Add Activity
                                </Button>
                              </Box>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails>
                              <Typography variant="body1">
                                {content.text_block?.text}
                              </Typography>
                              {content.image && (
                                <img
                                  src={"" + content.image?.path}
                                  alt="Sample"
                                  style={{
                                    maxWidth: "100%",
                                    height: "auto",
                                  }}
                                />
                              )}
                              {content.activity && (
                                <ActivityComponent
                                  activity={content.activity}
                                />
                              )}
                            </AccordionDetails>
                          </Accordion>
                        ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
            </AccordionDetails>
          </Accordion>
        ))}
    </Box>
  );
};
