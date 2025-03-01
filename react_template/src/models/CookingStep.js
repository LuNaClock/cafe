// src/models/CookingStep.js
class CookingStep {
  constructor(stepData = {}) {
    this.id = stepData.id || crypto.randomUUID();
    this.recipeId = stepData.recipeId || '';
    this.stepNumber = stepData.stepNumber || 1;
    this.instruction = stepData.instruction || '';
    this.imageUrls = stepData.imageUrls || [];
    this.timerDuration = stepData.timerDuration || 0;
  }

  toJSON() {
    return {
      id: this.id,
      recipeId: this.recipeId,
      stepNumber: this.stepNumber,
      instruction: this.instruction,
      imageUrls: this.imageUrls,
      timerDuration: this.timerDuration
    };
  }

  static fromJSON(json) {
    return new CookingStep(json);
  }
}

export default CookingStep;