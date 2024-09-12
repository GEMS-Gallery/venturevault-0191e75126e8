import { backend } from 'declarations/backend';

let currentOID = null;

async function loadOpportunities() {
    const opportunities = await backend.listOpportunities();
    const list = document.getElementById('opportunitiesListItems');
    list.innerHTML = '';
    opportunities.forEach(opp => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3><i class="fas fa-lightbulb"></i> ${opp.title}</h3>
            <p><strong>OID:</strong> ${opp.oid}</p>
            <p>${opp.description}</p>
            ${opp.source ? `<p><strong>Source:</strong> ${opp.source}</p>` : ''}
            ${opp.partner ? `<p><strong>Partner:</strong> ${opp.partner}</p>` : ''}
            <div class="opportunity-actions">
                <button onclick="editOpportunity('${opp.oid}')"><i class="fas fa-edit"></i> Edit</button>
                <button onclick="deleteOpportunity('${opp.oid}')"><i class="fas fa-trash-alt"></i> Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
}

async function saveOpportunity() {
    const oid = document.getElementById('oidInput').value;
    const title = document.getElementById('titleInput').value;
    const description = document.getElementById('descriptionInput').value;
    const source = document.getElementById('sourceInput').value || null;
    const partner = document.getElementById('partnerInput').value || null;

    if (currentOID) {
        await backend.updateOpportunity(currentOID, title, description, source, partner);
    } else {
        await backend.addOpportunity(oid, title, description, source, partner);
    }

    clearForm();
    await loadOpportunities();
}

function clearForm() {
    document.getElementById('oidInput').value = '';
    document.getElementById('titleInput').value = '';
    document.getElementById('descriptionInput').value = '';
    document.getElementById('sourceInput').value = '';
    document.getElementById('partnerInput').value = '';
    currentOID = null;
    document.getElementById('oidInput').disabled = false;
}

async function editOpportunity(oid) {
    try {
        const opportunityOpt = await backend.getOpportunity(oid);
        console.log('Received opportunity:', opportunityOpt); // Debug log
        if (opportunityOpt && opportunityOpt.length > 0) {
            const opportunity = opportunityOpt[0];
            document.getElementById('oidInput').value = opportunity.oid || '';
            document.getElementById('titleInput').value = opportunity.title || '';
            document.getElementById('descriptionInput').value = opportunity.description || '';
            document.getElementById('sourceInput').value = opportunity.source || '';
            document.getElementById('partnerInput').value = opportunity.partner || '';
            currentOID = oid;
            document.getElementById('oidInput').disabled = true;
        } else {
            throw new Error('Opportunity not found or invalid data structure');
        }
    } catch (error) {
        console.error('Error editing opportunity:', error);
        alert('Error editing opportunity: ' + error.message);
    }
}

async function deleteOpportunity(oid) {
    if (confirm('Are you sure you want to delete this opportunity?')) {
        try {
            const result = await backend.deleteOpportunity(oid);
            if (result) {
                await loadOpportunities();
            } else {
                throw new Error('Failed to delete opportunity');
            }
        } catch (error) {
            console.error('Error deleting opportunity:', error);
            alert('Error deleting opportunity: ' + error.message);
        }
    }
}

document.getElementById('saveButton').addEventListener('click', saveOpportunity);

window.editOpportunity = editOpportunity;
window.deleteOpportunity = deleteOpportunity;

loadOpportunities();
