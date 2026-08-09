from fastapi import APIRouter, BackgroundTasks

from database import SessionLocal
from agents.regulatory_intelligence import (
    RegulatoryIntelligenceAgent
)


router = APIRouter(
    prefix="/api/regulatory",
    tags=["Regulatory Intelligence"]
)


def run_regulatory_monitor():

    db = SessionLocal()

    try:

        agent = RegulatoryIntelligenceAgent()

        result = agent.run(db)

        print(
            "Regulatory monitoring completed:",
            result
        )

    except Exception as error:

        print(
            "Regulatory monitoring failed:",
            str(error)
        )

    finally:

        db.close()


@router.post("/monitor/run")
async def trigger_regulatory_monitor(
    background_tasks: BackgroundTasks
):

    background_tasks.add_task(
        run_regulatory_monitor
    )

    return {
        "success": True,
        "message": (
            "Regulatory intelligence monitoring "
            "started in the background."
        ),
        "status": "running"
    }