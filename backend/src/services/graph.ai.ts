import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { openAiModel } from "./ai.modelset.js";

const SoftwareGraphState = Annotation.Root({
  problem: Annotation<string>,
  product_analysis: Annotation<string>,
  system_architecture: Annotation<string>,
  database_design: Annotation<string>,
  summary: Annotation<string>,
});

type SoftwareGraphStateType = typeof SoftwareGraphState.State;

function getMessageText(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  return JSON.stringify(content);
}

const projectAnalysisNode = async (state: SoftwareGraphStateType) => {
  const analysis = await openAiModel.invoke([
    [
      "system",
      "You are a senior product analyst. Return concise but complete, practical outputs.",
    ],
    [
      "human",
      [
        "Analyze this software idea.",
        "",
        `Problem: ${state.problem}`,
        "",
        "Include:",
        "1) Primary users and goals",
        "2) Core features (MVP first)",
        "3) Risks and constraints",
      ].join("\n"),
    ],
  ]);

  return {
    product_analysis: getMessageText(analysis.content),
  };
};

const systemArchitectureNode = async (state: SoftwareGraphStateType) => {
  const architecture = await openAiModel.invoke([
    [
      "system",
      "You are a software architect. Keep recommendations implementation-ready.",
    ],
    [
      "human",
      [
        "Design a high-level system architecture.",
        "",
        `Problem: ${state.problem}`,
        `Product analysis: ${state.product_analysis}`,
        "",
        "Include:",
        "1) Service boundaries",
        "2) API style and key endpoints",
        "3) Deployment and scalability notes",
      ].join("\n"),
    ],
  ]);

  return {
    system_architecture: getMessageText(architecture.content),
  };
};

const databaseDesignNode = async (state: SoftwareGraphStateType) => {
  const database = await openAiModel.invoke([
    [
      "system",
      "You are a database engineer. Produce schema-level guidance that can be implemented quickly.",
    ],
    [
      "human",
      [
        "Propose a database design for this software idea.",
        "",
        `Problem: ${state.problem}`,
        `Product analysis: ${state.product_analysis}`,
        `Architecture: ${state.system_architecture}`,
        "",
        "Include:",
        "1) Main entities and relations",
        "2) Indexing and query performance notes",
        "3) Data integrity and migration strategy",
      ].join("\n"),
    ],
  ]);

  return {
    database_design: getMessageText(database.content),
  };
};

const summaryNode = async (state: SoftwareGraphStateType) => {
  const summary = await openAiModel.invoke([
    [
      "system",
      "You are a technical writer. Produce a short execution-ready plan.",
    ],
    [
      "human",
      [
        "Create a final implementation summary.",
        "",
        `Problem: ${state.problem}`,
        `Product analysis: ${state.product_analysis}`,
        `Architecture: ${state.system_architecture}`,
        `Database design: ${state.database_design}`,
        "",
        "Include a 7-day action plan.",
      ].join("\n"),
    ],
  ]);

  return {
    summary: getMessageText(summary.content),
  };
};

export const softwareHelperGraph = new StateGraph(SoftwareGraphState)
  .addNode("project_analysis", projectAnalysisNode)
  .addNode("system_architectures", systemArchitectureNode)
  .addNode("database_designs", databaseDesignNode)
  .addNode("summarys", summaryNode)
  .addEdge(START, "project_analysis")
  .addEdge("project_analysis", "system_architectures")
  .addEdge("system_architectures", "database_designs")
  .addEdge("database_designs", "summarys")
  .addEdge("summarys", END)
  .compile();

export async function runSoftwareHelperGraph(problem: string) {
  return softwareHelperGraph.invoke({
    problem,
    product_analysis: "",
    system_architecture: "",
    database_design: "",
    summary: "",
  });
}
