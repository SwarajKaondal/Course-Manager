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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ActivityComponent } from "../Activity/Activity";
import { PostRequest } from "../../utils/ApiManager";
import { useAuth } from "../../provider/AuthProvider";
import { useEffect, useState } from "react";
import InputDialog from "./InputDialog";
import ActivityDialog from "../Activity/ActivityDialog";

export interface ActivityFormData {
  question_id: string;
  question: string;
  ans_txt_1: string;
  ans_explain_1: string;
  correct_1: boolean;
  ans_txt_2: string;
  ans_explain_2: string;
  correct_2: boolean;
  ans_txt_3: string;
  ans_explain_3: string;
  correct_3: boolean;
  ans_txt_4: string;
  ans_explain_4: string;
  correct_4: boolean;
}

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
  const [inputDialog, setInputDialog] = useState<boolean>(false);
  const [dialogFields, setDialogFields] = useState<string[]>([]);
  const [contentType, setContentType] = useState<String>("");
  const [extraFields, setExtraFields] = useState<{ [key: string]: string }>({});

  const [activityDialog, setActivityDialog] = useState<boolean>(false);
  const [activityContentBlkId, setActivityContentBlkId] = useState<
    number | undefined
  >();

  useEffect(() => {}, [textbook]);

  const handleAddChapter = async (title: String, chapter_number: number) => {
    const response = await PostRequest("/admin/add_chapter", {
      role: auth.user?.role,
      title: title,
      chapter_number: chapter_number,
      textbook_id: textbook.textbook_id,
      user_id: auth.user?.user_id,
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
      user_id: auth.user?.user_id,
    });
    if (response.ok) {
      refreshTextbooks();
    }
  };

  const handleAddContentBlock = async (
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
      text_str: text,
      content_blk_id: content_block_id,
    });
    if (response.ok) {
      refreshTextbooks();
    }
  };

  const handleAddImage = async (img_path: String, content_block_id: number) => {
    const response = await PostRequest("/admin/add_picture", {
      role: auth.user?.role,
      image_path: img_path,
      content_blk_id: content_block_id,
    });
    if (response.ok) {
      refreshTextbooks();
    }
  };

  const handleAddActivity = async (formData: ActivityFormData) => {
    const response = await PostRequest("/admin/add_activity", {
      ...formData,
      role: auth.user?.role,
      content_blk_id: activityContentBlkId,
    });
    if (response.ok) {
      refreshTextbooks();
    }
  };

  const handleSubmit = (values: { [key: string]: string }) => {
    switch (contentType) {
      case "chapter":
        handleAddChapter(values["Title"], Number(values["Chapter Number"]));
        break;

      case "section":
        handleAddSection(
          values["title"],
          Number(values["Section Number"]),
          Number(extraFields["chapter_id"])
        );
        break;

      case "content_block":
        handleAddContentBlock(
          Number(values["Sequence Number"]),
          Number(extraFields["section_id"])
        );
        break;

      case "text":
        handleAddTextBlock(
          values["Text"],
          Number(extraFields["content_blk_id"])
        );
        break;

      case "picture":
        handleAddImage(
          values["Image path"],
          Number(extraFields["content_blk_id"])
        );
        break;

      default:
        console.error("Unknown contentType:", contentType);
    }
  };

  const handleAddContent = (
    content: String,
    fields: string[],
    extraFields: { [key: string]: string }
  ) => {
    setContentType(content);
    setDialogFields(fields);
    setExtraFields(extraFields);
    setInputDialog(true);
  };

  const handleCreateActivity = (content_blk_id: number) => {
    setActivityContentBlkId(content_blk_id);
    setActivityDialog(true);
  };

  const handleHideChapter = (chapter_id: any) => {
    handleModify("/ta/hideChapter", { chapter_id: chapter_id });
  };

  const handleHideSection = (section_id: any) => {
    console.log("heres");
    handleModify("/ta/hideSection", { section_id: section_id });
  };

  const handleHideContent = (content_blk_id: any) => {
    handleModify("/ta/hideContent", { content_blk_id: content_blk_id });
  };

  const handleDeleteChapter = (chapter_id: any) => {
    handleModify("/ta/deleteChapter", { chapter_id: chapter_id });
  };

  const handleDeleteSection = (section_id: any) => {
    handleModify("/ta/deleteSection", { section_id: section_id });
  };

  const handleDeleteContent = (content_blk_id: any) => {
    handleModify("/ta/deleteContent", { content_blk_id: content_blk_id });
  };

  const handleModify = (url: string, data: { [key: string]: any }) => {
    PostRequest(url, data)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        refreshTextbooks();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
          onClick={() =>
            handleAddContent("chapter", ["Title", "Chapter Number"], {})
          }
          sx={{ display: viewOnly ? "none" : "" }}
        >
          Add Chapter
          {viewOnly ? "View Only" : ""}
        </Button>
      </Box>
      <Divider />
      <InputDialog
        fieldNames={dialogFields}
        open={inputDialog}
        onClose={handleSubmit}
        onCancel={() => setInputDialog(false)}
      />
      <ActivityDialog
        open={activityDialog}
        onSubmit={handleAddActivity}
        onClose={() => setActivityDialog(false)}
      />
      {textbook.chapters &&
        textbook.chapters.length > 0 &&
        textbook.chapters.map((chapter, chapter_idx) => (
          <Accordion
            key={"chapter-" + chapter_idx}
            defaultExpanded
            sx={{
              boxShadow: "none",
              border: "none",
              display:
                chapter.hidden &&
                auth.user?.role_name.toLowerCase() === "student"
                  ? "none"
                  : "",
            }}
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
                {auth.user?.role_name.toLowerCase() !== "student" && (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    color="secondary"
                    onClick={() => handleHideChapter(chapter.chapter_id)}
                    sx={{
                      display: viewOnly ? "none" : "",
                      ml: 2,
                    }}
                  >
                    {chapter.hidden ? "Unhide Chapter" : "Hide Chapter"}
                  </Button>
                )}

                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  color="secondary"
                  onClick={() => handleDeleteChapter(chapter.chapter_id)}
                  sx={{
                    display: viewOnly || !chapter.can_edit ? "none" : "",
                    ml: 2,
                  }}
                >
                  Delete Content
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  color="primary"
                  onClick={() =>
                    handleAddContent("section", ["title", "Section Number"], {
                      chapter_id: "" + chapter.chapter_id,
                    })
                  }
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
                    sx={{
                      boxShadow: "none",
                      border: "none",
                      display:
                        section.hidden &&
                        auth.user?.role_name.toLowerCase() === "student"
                          ? "none"
                          : "",
                    }}
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
                        {section.section_number} {section.title}
                      </Typography>
                      <Box sx={{ ml: "auto" }}>
                        {auth.user?.role_name.toLowerCase() !== "student" && (
                          <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            color="secondary"
                            onClick={() =>
                              handleHideSection(section.section_id)
                            }
                            sx={{
                              display: viewOnly ? "none" : "",
                              ml: 2,
                            }}
                          >
                            {section.hidden ? "Unhide Section" : "Hide Section"}
                          </Button>
                        )}

                        <Button
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          color="secondary"
                          onClick={() =>
                            handleDeleteSection(section.section_id)
                          }
                          sx={{
                            display:
                              viewOnly || !section.can_edit ? "none" : "",
                            ml: 2,
                          }}
                        >
                          Delete Content
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          color="primary"
                          onClick={() =>
                            handleAddContent(
                              "content_block",
                              ["Sequence Number"],
                              { section_id: "" + section.section_id }
                            )
                          }
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
                        section.content_blocks
                          .sort((a, b) => a.sequence_number - b.sequence_number)
                          .map((content, content_idx) => (
                            <Accordion
                              key={"content-" + content_idx}
                              defaultExpanded
                              sx={{
                                boxShadow: "none",
                                border: "none",
                                display:
                                  content.hidden === 1 &&
                                  auth.user?.role_name.toLowerCase() ===
                                    "student"
                                    ? "none"
                                    : "",
                              }}
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
                                  {section.section_number}.
                                  {content.sequence_number}
                                </Typography>
                                <Box
                                  sx={{ ml: "auto", display: "flex", gap: 1 }}
                                >
                                  <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    color="primary"
                                    onClick={() =>
                                      handleAddContent("text", ["Text"], {
                                        content_blk_id:
                                          "" + content.content_block_id,
                                      })
                                    }
                                    sx={{
                                      display: viewOnly ? "none" : "",
                                    }}
                                  >
                                    Add Text
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    color="primary"
                                    onClick={() =>
                                      handleAddContent(
                                        "picture",
                                        ["Image path"],
                                        {
                                          content_blk_id:
                                            "" + content.content_block_id,
                                        }
                                      )
                                    }
                                    sx={{
                                      display: viewOnly ? "none" : "",
                                    }}
                                  >
                                    Add Image
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    color="primary"
                                    onClick={() =>
                                      handleCreateActivity(
                                        content.content_block_id
                                      )
                                    }
                                    sx={{
                                      display: viewOnly ? "none" : "",
                                    }}
                                  >
                                    Add Activity
                                  </Button>

                                  {auth.user?.role_name.toLowerCase() !==
                                    "student" && (
                                    <Button
                                      variant="outlined"
                                      startIcon={<EditIcon />}
                                      color="secondary"
                                      onClick={() =>
                                        handleHideContent(
                                          content.content_block_id
                                        )
                                      }
                                      sx={{
                                        display: viewOnly ? "none" : "",
                                        ml: 2,
                                      }}
                                    >
                                      {content.hidden
                                        ? "Unhide Content"
                                        : "Hide Content"}
                                    </Button>
                                  )}

                                  <Button
                                    variant="outlined"
                                    startIcon={<DeleteIcon />}
                                    color="secondary"
                                    onClick={() =>
                                      handleDeleteContent(
                                        content.content_block_id
                                      )
                                    }
                                    sx={{
                                      display:
                                        viewOnly || !content.can_edit
                                          ? "none"
                                          : "",
                                      ml: 2,
                                    }}
                                  >
                                    Delete Content
                                  </Button>
                                </Box>
                              </AccordionSummary>
                              <Divider />
                              <AccordionDetails>
                                {content.text_block !== null &&
                                  content.text_block !== undefined &&
                                  content.text_block.map((text_block, i) => (
                                    <Typography variant="body1">
                                      {text_block.text}
                                    </Typography>
                                  ))}

                                {content.image !== null &&
                                  content.image !== undefined &&
                                  content.image.map((image, i) => (
                                    <img
                                      src={"" + image.path}
                                      alt="Sample"
                                      style={{
                                        maxWidth: "100%",
                                        height: "auto",
                                      }}
                                    />
                                  ))}
                                {content.activity !== undefined &&
                                  content.activity !== null &&
                                  content.activity.length > 0 && (
                                    <ol>
                                      {content.activity.map((activiy, i) => {
                                        return (
                                          <li key={"activity-" + i}>
                                            <ActivityComponent
                                              activity={activiy}
                                            />
                                          </li>
                                        );
                                      })}
                                    </ol>
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
