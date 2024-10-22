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

export const TextbookComponent = ({
  textbook,
  viewOnly,
}: {
  textbook: Textbook;
  viewOnly: Boolean;
}) => {
  const handleAddChapter = () => {
    // Logic for adding a new section
    alert("Add Section clicked!");
  };

  const handleAddSection = () => {
    // Logic for adding a new section
    alert("Add Section clicked!");
  };

  const handleAddContent = () => {
    // Logic for adding a new section
    alert("Add Section clicked!");
  };

  const handleAddTextBlock = () => {
    // Logic for adding a new section
    alert("Add Section clicked!");
  };

  const handleAddImage = () => {
    // Logic for adding a new section
    alert("Add Section clicked!");
  };

  const handleAddActivity = () => {
    // Logic for adding a new section
    alert("Add Section clicked!");
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
          onClick={handleAddChapter}
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
