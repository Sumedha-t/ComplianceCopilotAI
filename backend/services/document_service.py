from orchestrator.workflow import WorkflowOrchestrator


class DocumentService:

    def __init__(self):

        self.workflow = WorkflowOrchestrator()

    def process(
        self,
        filename,
    ):

        context = self.workflow.start_workflow(
            "existing_business",
            filename
        )

        return {
            "success": True,
            "message": "Document uploaded successfully.",
            "data": context.to_dict(),
        }