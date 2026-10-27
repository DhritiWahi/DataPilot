from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from database import Base

class PipelineRequirement(Base):
    __tablename__ = "pipeline_requirements"

    id = Column(Integer, primary_key=True, index=True)
    source_table = Column(String, nullable=False)
    target_table = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))