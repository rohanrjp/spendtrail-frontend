import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com'

export async function GET() {
  try {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In a real-world scenario, you would fetch this from an external API
    // const response = await fetch(`${API_URL}/financial-advice`)
    // const data = await response.json()

    const advice = "The user is in a healthy financial position, with total income significantly exceeding total expenses. While spending on Food is slightly over budget at $500 compared to the $400 allotted, Transport spending aligns perfectly with the budgeted $350. Entertainment expenditure is significantly higher than the budget, at $200 compared to the $100 allocated, suggesting a possible area for adjustment. Overall, the user is generally adhering to their budget plan but could benefit from a closer look at discretionary spending, specifically Entertainment. A possible next step would be to re-evaluate and adjust the Entertainment budget to better align with actual spending habits and potentially reallocate the surplus into savings."

    return NextResponse.json(advice)
  } catch (error) {
    console.error('Error fetching financial advice:', error)
    return NextResponse.json({ error: 'Failed to fetch financial advice' }, { status: 500 })
  }
}

