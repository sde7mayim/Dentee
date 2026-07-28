/* ==========================================================================
   DENTEE - AI-POWERED DENTAL ASSISTANT MODULE ("DENTEE AI")
   Symptom checker, treatment recommendations, clinical note synthesizer, and automated clinical QA
   ========================================================================== */

const AiAssistantModule = {
  chatLogs: [
    { sender: "ai", text: "Hello! I am Dentee AI, your clinical dental assistant. How can I assist you with symptom evaluation, treatment planning, or clinical documentation today?" }
  ],

  init() {
    this.render();
  },

  render() {
    const container = document.getElementById("ai-assistant-module");
    if (!container) return;

    container.innerHTML = `
      <div class="card" style="max-width:950px; margin:0 auto;">
        <div class="card-header" style="border-bottom:1px solid var(--border-color); padding-bottom:1rem;">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <div style="font-size:2rem; background:var(--bg-body); width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center;">🤖</div>
            <div>
              <h2 class="card-title">Dentee AI - Clinical Dental Assistant</h2>
              <div class="page-subtitle">Powered by Dental AI Models for Diagnosis, Treatment Planning & SOAP Documentation.</div>
            </div>
          </div>
          <span class="badge badge-success">AI ONLINE</span>
        </div>

        <!-- Quick AI Capability Cards -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:0.75rem; margin:1rem 0;">
          <button class="btn btn-secondary btn-sm" onclick="AiAssistantModule.triggerPrompt('Assess symptoms: Sharp localized pain on lower molar #19 when chewing cold foods.')">
            🩺 Symptom Checker
          </button>
          <button class="btn btn-secondary btn-sm" onclick="AiAssistantModule.triggerPrompt('Suggest treatment plan for deep occlusal caries on tooth #14 with reversible pulpitis.')">
            💡 Treatment Advisor
          </button>
          <button class="btn btn-secondary btn-sm" onclick="AiAssistantModule.triggerPrompt('Generate SOAP clinical note for root canal therapy completed on tooth #19 under local anesthesia.')">
            📝 SOAP Note Generator
          </button>
          <button class="btn btn-secondary btn-sm" onclick="AiAssistantModule.triggerPrompt('Generate patient post-operative instructions for surgical tooth extraction.')">
            💬 Patient Instructions
          </button>
        </div>

        <!-- Chat Conversation Container -->
        <div style="height:380px; overflow-y:auto; border:1px solid var(--border-color); background:var(--bg-body); border-radius:8px; padding:1.25rem; margin-bottom:1rem; display:flex; flex-direction:column; gap:1rem;" id="ai-chat-window">
          ${this.chatLogs.map(msg => `
            <div style="display:flex; gap:0.75rem; ${msg.sender === 'user' ? 'justify-content:flex-end;' : 'justify-content:flex-start;'}">
              ${msg.sender === 'ai' ? '<div style="font-size:1.5rem;">🤖</div>' : ''}
              <div style="max-width:80%; padding:0.85rem 1.1rem; border-radius:12px; font-size:0.9rem; line-height:1.5; ${msg.sender === 'user' ? 'background:var(--primary-color); color:white; border-bottom-right-radius:2px;' : 'background:var(--bg-surface); color:var(--text-color); border:1px solid var(--border-color); border-bottom-left-radius:2px;'}">
                ${msg.text}
              </div>
              ${msg.sender === 'user' ? '<div style="font-size:1.5rem;">👨⚕️</div>' : ''}
            </div>
          `).join('')}
        </div>

        <!-- Chat Input Form -->
        <form onsubmit="AiAssistantModule.handleSend(event)" style="display:flex; gap:0.5rem;">
          <input type="text" id="ai-user-input" class="form-control" placeholder="Ask Dentee AI about dental symptoms, ICD codes, treatment recommendations..." required style="flex:1;">
          <button type="submit" class="btn btn-primary" style="padding:0.75rem 1.5rem;">Send 🚀</button>
        </form>
      </div>
    `;

    const chatWin = document.getElementById("ai-chat-window");
    if (chatWin) chatWin.scrollTop = chatWin.scrollHeight;
  },

  triggerPrompt(promptText) {
    document.getElementById("ai-user-input").value = promptText;
    this.handleSend(new Event('submit'));
  },

  handleSend(e) {
    if (e && e.preventDefault) e.preventDefault();
    const input = document.getElementById("ai-user-input");
    const query = input.value.trim();
    if (!query) return;

    this.chatLogs.push({ sender: "user", text: query });
    input.value = "";
    this.render();

    // AI Response Simulation Logic
    setTimeout(() => {
      let aiReply = "";
      const qLower = query.toLowerCase();

      if (qLower.includes("symptom") || qLower.includes("pain") || qLower.includes("chewing")) {
        aiReply = `<strong>Differential Diagnosis:</strong><br>
        1. <em>Reversible Pulpitis / Deep Caries:</em> High sensitivity to cold/sweet.<br>
        2. <em>Irreversible Pulpitis:</em> Lingering pain or nocturnal throbbing.<br>
        3. <em>Cracked Tooth Syndrome:</em> Sharp pain specifically upon pressure release.<br><br>
        <strong>Recommended Next Steps:</strong> Perform cold thermal testing, electric pulp test (EPT), and periapical radiograph for tooth #19.`;
      } else if (qLower.includes("treatment") || qLower.includes("plan") || qLower.includes("caries")) {
        aiReply = `<strong>AI Treatment Plan Recommendation:</strong><br>
        • <strong>Option A (Conservative):</strong> Indirect Pulp Capping with Calcium Hydroxide / MTA + Composite Resin Restoration (D2392). Estimated Cost: $240.<br>
        • <strong>Option B (Endodontic):</strong> Single-visit Anterior/Molar Root Canal Therapy (D3310) followed by Zirconia Core & Crown (D2750). Estimated Cost: $2,050.`;
      } else if (qLower.includes("soap") || qLower.includes("note") || qLower.includes("note generator")) {
        aiReply = `<strong>Generated SOAP Clinical Note:</strong><br>
        <strong>S (Subjective):</strong> Patient reports moderate pain in lower right quadrant when drinking cold liquids.<br>
        <strong>O (Objective):</strong> Deep occlusal caries observed on Tooth #19. EPT responsive. Radiograph confirms 1.5mm dentin margin to pulp chamber.<br>
        <strong>A (Assessment):</strong> D2392 Composite Restoration on Tooth #19.<br>
        <strong>P (Plan):</strong> Administered 1.8ml 4% Articaine with 1:100k Epi. Complete caries excavation, bonding agent applied, light-cured resin placed. Occlusion checked and adjusted.`;
      } else {
        aiReply = `Based on clinical guidelines (ADA/AAO), I suggest evaluating diagnostic radiographs and reviewing the active patient history. Would you like me to generate a formal clinical consent form or draft a digital prescription?`;
      }

      this.chatLogs.push({ sender: "ai", text: aiReply });
      this.render();
    }, 600);
  }
};
